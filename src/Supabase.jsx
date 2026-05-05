import {createClient} from "@supabase/supabase-js";

const URL="https://zfndrynpkzrhpmcwwail.supabase.co";
const KEY="sb_publishable_B8X2wR7S3IkGH7OHVFFrDg_te2Zh_hv";

export const supabase=createClient(URL,KEY);