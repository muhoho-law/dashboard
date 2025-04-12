import { createClient } from "@supabase/supabase-js";

const useSupabaseDocuments = () => {
  const config = useRuntimeConfig();

  // Get the Supabase URL and ANON key from the public runtime config
  const supabaseUrl = config.public.supabaseUrl;
  const supabaseAnonKey = config.public.supabaseServiceRoleKey;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL or ANON key is missing from runtime config");
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const uploadDocuments = async (files: File[], component: string) => {
    const uploadedDocuments = [];

    for (const file of files) {
      const filePath = `${component}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase
        .storage
        .from('documents') // Make sure you have a bucket named 'documents'
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error.message);
        continue; // Skip this file and move to the next
      }

      // Generate the URL for the uploaded file
      const { data: publicUrlData } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        uploadedDocuments.push({
          name: file.name,
          url: publicUrlData.publicUrl,
        });
      } else {
        console.error("Failed to retrieve public URL for:", filePath);
      }
    }

    console.log("Uploaded Documents:", uploadedDocuments); // Check what's being returned
    return uploadedDocuments;
  };

  const listDocuments = async () => {
    const { data, error } = await supabase.storage.from('documents').list('', {
      limit: 100,
      offset: 0,
    });

    if (error) throw error;

    return data.map(file => ({
      name: file.name,
      url: supabase.storage.from('documents').getPublicUrl(file.name).data.publicUrl
    }));
  };

  return { uploadDocuments, listDocuments };
};

export default useSupabaseDocuments;
