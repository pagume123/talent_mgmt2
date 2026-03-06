import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { status } = await req.json();
        const { id } = await params;
        const supabase = await createClient();

        if (!supabase) {
            return NextResponse.json({ error: "Supabase not connected" }, { status: 500 });
        }

        const { data, error } = await supabase
            .from('requests')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, request: data });
    } catch (error: any) {
        console.error("Request update error:", error);
        return NextResponse.json({ error: error.message || "Failed to update request" }, { status: 500 });
    }
}
