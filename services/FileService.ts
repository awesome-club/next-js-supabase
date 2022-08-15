import { supabase } from "../utils/supabase";

const BucketName = "awesome";

export function uploadFile(name: string, file: File) {
  return supabase
    .storage
    .from(BucketName)
    .upload(name, file, {
      cacheControl: "3600",
    });
}

export function createSignedUrl(preview: string) {
  return supabase
    .storage
    .from(BucketName)
    .createSignedUrl(preview, 60);
}
