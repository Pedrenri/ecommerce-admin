import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Valor é obrigatória", { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse("StoreId é obrigatório", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Loja não encontrada", { status: 404 });
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    // @ts-ignore

    return NextResponse.json(color, { status: 201 });
  } catch (error) {
    console.error("[COLORS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("StoreId é obrigatório", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    // @ts-ignore

    return NextResponse.json(colors, { status: 201 });
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
