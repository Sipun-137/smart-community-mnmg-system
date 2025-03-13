import { NextRequest, NextResponse } from "next/server";
import { AuthUser } from "../../auth/route";
import Visitor from "@/models/Visitor";




export async function GET(req: NextRequest, { params
}: {
    params: Promise<{ id: string }>
}) {
    try {

        const user = AuthUser(req);
        if (!user) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const { id } = await params;
        const visitor = await Visitor.findById(id);
        if (!visitor) {
            return NextResponse.json({ success: false, message: "unable to find visitor" }, { status: 400 });
        } else {
            return NextResponse.json({ success: true, visitor })
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message ,message:"service error"}, { status: 500 });
    }
}