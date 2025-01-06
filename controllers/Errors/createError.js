
const ErrorModel = require('../../models/errorModel')

const setPriority = (num_of_times_occured) => {
  if (num_of_times_occured > 10 && num_of_times_occured < 20)
    return "normal"
  else if (num_of_times_occured >= 20)
    return "high"
  else "low"
}

const CreateError = async (req, res) => {
  const { errorType, description } = req.body;

  if (!errorType || !description) {
    return res.status(400).json({
      message: 'Bad Request: errorType and description are required fields'
    })
  }

  try {
    const existingError = await ErrorModel.findOne({ errorType, description });

    if (existingError) {
      // If error exists, increment numOfTimesOccurred by 1
      const updateResult = await ErrorModel.updateOne(
        { _id: existingError._id },
        { $inc: { num_of_times_occured: 1 }, $set: { priority: setPriority(existingError.num_of_times_occured) }, }
      );
      res.status(200).json({
        message: 'Error occurrence updated',
        matchedCount: updateResult.matchedCount,
        modifiedCount: updateResult.modifiedCount,
      });
    } else {
      // If error doesn't exist, insert it as a new document
      const newError = {
        errorType,
        description,
        num_of_times_occured: 1,
        created_at: new Date(),
        status: 'logged',
        priority: 'low'
      };
      const insertResult = await ErrorModel.create(newError);
      res.status(201).json({
        message: 'New error logged',
        errorId: insertResult.insertedId,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = CreateError
