import { getOptions } from "../lib/get-options";
import { serve } from "../server";

serve(await getOptions());
