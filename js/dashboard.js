// use existing supabase

const { data, error } =
await supabase
.from("lawyer_registration")
.select("*");