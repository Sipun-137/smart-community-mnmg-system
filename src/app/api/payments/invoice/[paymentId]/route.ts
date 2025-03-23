import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import Payment from "@/models/Payment";
import { communityname } from "@/utils";
import { AuthUser } from "@/services/AuthService";


// interface Params {
//   paymentId: string;
// }

export async function GET(req: NextRequest, {
    params,
}: {
    params: Promise<{ paymentId: string }>
}) {
    try {
        const user = await AuthUser(req);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "Unauthorized Access" },
                { status: 401 }
            );
        }

        const { paymentId } = await params;
        const payment = await Payment.findById(paymentId).populate("userId","email name");
        if (!payment) {
            return NextResponse.json(
                { success: false, error: "Payment not found" },
                { status: 404 }
            );
        }

        const invoiceDir = path.join(process.cwd(), "public/invoices");
        if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });

        const invoicePath = path.join(invoiceDir, `${paymentId}.pdf`);
        const invoiceUrl = `/invoices/${paymentId}.pdf`;

        if (fs.existsSync(invoicePath)) {
            return NextResponse.json({ success: true, invoiceUrl });
        }

        // ✅ Start Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        // ✅ Generate HTML Template
        const htmlContent = `
          <html>
          <head>
             <title>Invoice</title>
    <style>
         * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        body {
            background-color: #fff;
        }

        .invoice-container {
            width: 210mm; /* A4 Width */
            min-height: 297mm; /* A4 Height */
            padding: 20mm;
            margin: auto;
            background: #fff;
            border: 2px solid #ddd;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        }

        .invoice-header {
            text-align: center;
            font-size: 40px;
            font-weight: bold;
            color: #007bff;
            padding: 15px;
            border-bottom: 2px solid #007bff;
            margin-bottom: 20px;
        }

        .invoice-details {
            border: 2px solid #ddd;
            border-radius: 10px;
            padding: 10px;
        }

        .invoice-item {
            display: flex;
            justify-content: space-between;
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }

        .invoice-item:last-child {
            border-bottom: none;
        }

        .contact {
            margin-top: 15px;
            padding: 10px;
            border: 2px solid #007bff;
            border-radius: 10px;
            text-align: center;
            color: #007bff;
            font-weight: bold;
        }

        .contact p {
            font-size: 12px;
            margin: 5px 0;
            color: #333;
        }

       
    </style>
</head>
<body>

    <div class="invoice-container">
        <div class="invoice-header">
            ${communityname} Community
        </div>

        <div class="invoice-details">
            <div class="invoice-item">
                <span>Invoice ID</span>
                <span>${payment._id}</span>
            </div>
            <div class="invoice-item">
                <span>Name</span>
                <span>${payment.userId.name}</span>
            </div>
            <div class="invoice-item">
                <span>Email</span>
                <span>${payment.userId.email}</span>
            </div>
            <div class="invoice-item">
                <span>Mode of Payment</span>
                <span>${payment.modeOfPayment}</span>
            </div>
            <div class="invoice-item">
                <span>Amount</span>
                <span>₹${payment.amount}</span>
            </div>
            <div class="invoice-item">
                <span>Date</span>
                <span>${new Date(payment.paymentDate).toLocaleDateString()}</span>
            </div>
            <div class="invoice-item">
                <span>Status</span>
                <span>${payment.status}</span>
            </div>
        </div>

        <div class="contact">
            <h3>Contact Us</h3>
            <p>Email:codersipun345@outlook.com</p>
            <p>Contact: 7008830763</p>
            <p>Website: smartcommunitymanagementsytem.com</p>
        </div>
    </div>

</body>
          </html>
        `;

        // ✅ Set HTML Content
        await page.setContent(htmlContent);

        // ✅ Generate PDF
        await page.pdf({ path: invoicePath, format: "A4" });

        await browser.close();

        // ✅ Save invoice URL in DB
        payment.invoiceUrl = invoiceUrl;
        await payment.save();

        return NextResponse.json({ success: true, invoiceUrl });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: (error as Error).message },
            { status: 500 }
        );
    }
}
