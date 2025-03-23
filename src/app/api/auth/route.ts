import User from "@/models/User";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import connect from "@/services/Config";

connect()
export const dynamic = 'force-dynamic'



export async function POST(req: NextRequest) {
    const { email, password } = await req.json()
    try {
        const valid = await User.findOne({ email });
        if (!valid) return NextResponse.json({ success: false, message: "Invalid Email" })
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


