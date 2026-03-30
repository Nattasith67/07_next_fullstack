import { NextResponse } from "next/server";
import { mysqlPool } from "@/utils/db";

// GET - ดึงข้อมูลตาม ID
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = mysqlPool.promise();
  const [rows] = await promisePool.query(
    `SELECT * FROM attractions WHERE id = ?;`,
    [id]
  );
  if (rows.length === 0) {
    return NextResponse.json(
      { message: `Attraction with id ${id} not found` },
      { status: 404 }
    );
  }
  return NextResponse.json(rows[0]);
}

// POST - เพิ่มข้อมูล
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, detail, coverimage, latitude, longitude } = body;

    const promisePool = mysqlPool.promise();
    const [result] = await promisePool.query(
      `INSERT INTO attractions (name, detail, coverimage, latitude, longitude)
       VALUES (?, ?, ?, ?, ?)`,
      [name, detail, coverimage, latitude, longitude]
    );

    const [rows] = await promisePool.query(
      `SELECT * FROM attractions WHERE id = ?`,
      [result.insertId]
    );
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PUT - แก้ไขข้อมูล
export async function PUT(request, { params }) { // เพิ่ม { params }
  try {
    const { id } = params;
    const body = await request.json(); // แก้ไขตรงนี้
    const { name, detail, coverimage, latitude, longitude } = body;
    
    const promisePool = mysqlPool.promise();
    
    // เช็คว่ามีของไหม
    const [exist] = await promisePool.query(
      'SELECT id FROM attractions WHERE id = ?', [id]
    );
    
    if (exist.length === 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    // แก้ไข SQL: latitude และ longitude ให้ถูกต้อง
    await promisePool.query(
      'UPDATE attractions SET name = ?, detail = ?, coverimage = ?, latitude = ?, longitude = ? WHERE id = ?',
      [name, detail ?? "", coverimage, latitude ?? "", longitude ?? "", id]
    );

    const [rows] = await promisePool.query(
      'SELECT * FROM attractions WHERE id = ?', [id]
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE - ลบข้อมูล
export async function DELETE(request, { params }) {
  try {
    const { id } = params; // params ใน Next.js ไม่ต้อง await
    const promisePool = mysqlPool.promise();

    const [exist] = await promisePool.query(
      'SELECT id FROM attractions WHERE id = ?', [id]
    );

    if (exist.length === 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    await promisePool.query('DELETE FROM attractions WHERE id = ?', [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}