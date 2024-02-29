import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name } = body;

    if (!name) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId,
      },
    });
    // @ts-ignore

    return new NextResponse(store, { status: 201 });
  } catch (error) {
    console.error("[STORES POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
