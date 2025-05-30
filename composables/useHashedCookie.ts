import { type CookieOptions, type CookieRef } from "nuxt/app";
import { deleteCookie, getCookie, setCookie } from "h3";
import { encrypt, decrypt } from "~~/utils/encryption";
import { parse, serialize } from "cookie-es";
import { isEqual } from "ohash";
import destr from "destr";

import type { H3Event } from "h3";
import type { CookieSerializeOptions } from "cookie-es";

const CookieDefaults: CookieOptions<any> = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) =>
    encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val)),
};

// Wrapper around useHashedCookie with hash functionality
export function useHashedCookie<T = string | null | undefined>(
  name: string,
  _opts?: CookieOptions<T>
): CookieRef<T> {
  const opts = { ...CookieDefaults, ..._opts };

  const cookies = readRawCookies(opts) || {};

  const cookie = ref<T | undefined>(
    (decrypt(cookies[name]) as any) ?? opts.default?.()
  );

  if (process.client) {
    const channel =
      typeof BroadcastChannel === "undefined"
        ? null
        : new BroadcastChannel(`nuxt:cookies:${name}`);

    if (getCurrentInstance()?.isUnmounted) {
      channel?.close();
    }

    const callback = () => {
      writeClientCookie(name, cookie.value, opts as CookieSerializeOptions);
      channel?.postMessage(toRaw(cookie.value));
    };

    let watchPaused = false;

    if (channel) {
      channel.onmessage = (event) => {
        watchPaused = true;
        cookie.value = event.data;
        nextTick(() => {
          watchPaused = false;
        });
      };
    }

    if (opts.watch) {
      watch(
        cookie,
        (newVal, oldVal) => {
          if (watchPaused || isEqual(encrypt(newVal), oldVal)) {
            return;
          }
          callback();
        },
        { deep: opts.watch !== "shallow" }
      );
    } else {
      callback();
    }
  } else if (process.server) {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (!isEqual(cookie.value, decrypt(cookies[name]))) {
        writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
      }
    };
    const unhook = nuxtApp.hooks.hookOnce(
      "app:rendered",
      writeFinalCookieValue
    );
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook(); // don't write cookie subsequently when app:rendered is called
      return writeFinalCookieValue();
    });
  }

  return cookie as CookieRef<T>;
}

function readRawCookies(
  opts: CookieOptions = {}
): Record<string, string> | undefined {
  if (process.server) {
    return parse(useRequestEvent()?.node.req.headers.cookie || "", opts);
  } else if (process.client) {
    return parse(document.cookie, opts);
  }
}

function serializeCookie(
  name: string,
  value: any,
  opts: CookieSerializeOptions = {}
) {
  if (value === null || value === undefined) {
    return serialize(name, value, { ...opts, maxAge: -1 });
  }
  return serialize(name, encrypt(value), opts);
}

function writeClientCookie(
  name: string,
  value: any,
  opts: CookieSerializeOptions = {}
) {
  if (process.client) {
    document.cookie = serializeCookie(name, value, opts);
  }
}

function writeServerCookie(
  event: H3Event,
  name: string,
  value: any,
  opts: CookieSerializeOptions = {}
) {
  if (event) {
    // update if value is set
    if (value !== null && value !== undefined) {
      return setCookie(event, name, encrypt(value), opts);
    }

    // delete if cookie exists in browser and value is null/undefined
    if (getCookie(event, name) !== undefined) {
      return deleteCookie(event, name, opts);
    }

    // else ignore if cookie doesn't exist in browser and value is null/undefined
  }
}

