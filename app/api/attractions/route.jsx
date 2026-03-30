import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

export async function GET() {
  try {
    const promisePool = mysqlPool.promise();
    // 1. ตรวจสอบว่า query สำเร็จไหม
    const [rows] = await promisePool.query("SELECT * FROM attractions");
    
    // 2. ต้อง return NextResponse เสมอ ห้ามปล่อยว่าง
    return NextResponse.json(rows); 
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}