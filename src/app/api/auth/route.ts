import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import connect from "@/services/Config";

connect()
export const dynamic = 'force-dynamic'

interface decodedToken{
    id:string,
    email:string,
    role:string
}

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    try {
        const valid = await User.findOne({ email });
        if (valid) {
            const isValidated = await bcryptjs.compare(password, valid.password)
            if (!isValidated) {
                return NextResponse.json({
                    success: false,
                    message: 'Invalid Password'
                })
            }
            const token = jwt.sign({
                id: valid._id,
                email: valid?.email,
                role: valid?.role
            }, process.env.JWT_SECRETKEY as string, { expiresIn: '1d' })
            const user = {
                email: valid.email,
                name: valid.name,
                _id: valid.id,
                role: valid.role

            }
            console.log('login successful')
            return NextResponse.json({
                success: true,
                message: "login Successful",
                token,
                user
            })

        }
        return NextResponse.json({
            success: false,
            message: "error in login with the given credentials"
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "error in login with the given credentials"
        })
    }
}

export async function AuthUser(req: NextRequest) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return false
    }
    try {
        const extractAuthUserinfo: decodedToken | null = jwt.decode(token) as decodedToken | null;
        if (extractAuthUserinfo) {
            // Return the decoded token if authentication is successful
            return extractAuthUserinfo;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log(error);
    }
}
