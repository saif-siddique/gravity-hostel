import { FeeModel } from "@/models/Fee.model";

export async function POST(request: Request) {
  const { _id } = await request.json();

  if (!_id) {
    return Response.json(
      {
        success: false,
        message: "Prompt required",
      },
      { status: 404 },
    );
  }

  try {

    const response = await FeeModel.find({ student: _id });

    if (!response.length) {
      return Response.json(
        {
          success: false,
          message: "No result to show",
        },
        { status: 404 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "successfully fetched",
        data: response,
      },
      { status: 200 },
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "something went wrong",
      },
      { status: 500 },
    );
  }
}
