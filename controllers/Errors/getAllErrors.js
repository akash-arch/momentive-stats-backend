const ErrorModel = require('../../models/errorModel');

const getErrorList = async (req, res) => {
  try {
   // const page = parseInt(req.query.page) || 1;
   // const limit = parseInt(req.query.limit) || 10;
   // const skip = (page - 1) * limit;

    const errorsList = await ErrorModel.find({ status: 'logged' })
    // .skip(skip) // Skip the appropriate number of records
    //  .limit(limit);

    // Get the total count of records in the database (for pagination purposes)
    // const totalErrors = await ErrorModel.countDocuments();

    // Calculate total number of pages
    // const totalPages = Math.ceil(totalErrors / limit);

    res.status(200).json({
      errorsList,
      /* pagination: {
        page,
        limit,
        totalPages,
        totalErrors
      } */
    });

  } catch (error) {
    console.error("Error fetching errors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = getErrorList