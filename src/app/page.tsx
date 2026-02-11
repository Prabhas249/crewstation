import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Check if they have a workspace (completed onboarding)
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (workspace) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  redirect("/login");
}
