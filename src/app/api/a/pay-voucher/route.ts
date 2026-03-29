import { StudentModel } from "@/models/StudentSignup.model";

export async function POST(request: Request) {
  const { prompt } = await request.json();

  if (!prompt) {
    return Response.json(
      {
        success: false,
        message: "Prompt required",
      },
      { status: 404 },
    );
  }

  const searchTerm = prompt;
  try {
    const response = await StudentModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user", 
          foreignField: "_id",
          as: "userDetails", 
        },
      },
      { $unwind: "$userDetails" },
      {
        $match: {
          $or: [
            { "userDetails.fullName": { $regex: searchTerm, $options: "i" } }, // Searching the joined field
            { cnic: { $regex: searchTerm, $options: "i" } },
            { phone: { $regex: searchTerm, $options: "i" } },
          ],
        },
      },
      {
        $project: {
            _id: 1,
            "userDetails.fullName": 1
        }
      }
    ]);

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
