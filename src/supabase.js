import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qboizbrjtkumfrvstono.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log(supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;

// console.log("Hello!");
// console.log(supabase);

// const fetchData = async() => {
//     // const { data, error } = await supabase
//     //     .from('smoothies')
//     //     .insert([{
//     //         name: 'The Empire Strikes Back',
//     //         // description: 'After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda.'
//     //     }, {
//     //         name: 'Return of the Jedi',
//     //         // description: 'After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star.'
//     //     }]);

//     const { data, error } = await supabase.from("smoothies").select("*");
//     console.log(data);
// };
// console.log(fetchData);