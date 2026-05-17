const applicationModel = require("../models/applicationModel");
const catchAsync = require("../utils/catchAsync");

class ApiFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    if (this.queryObj) {
      const excluded = ["pages", "fields", "sort", "limit"];
      const clonedObj = { ...this.queryObj };

      excluded.forEach((item) => delete clonedObj[item]);
      let filterStr = JSON.stringify(clonedObj);

      filterStr = filterStr.replace(
        /\b(lt|lte|gt|gte)\b/g,
        (match) => `$${match}`,
      );
      this.query = this.query.find(JSON.parse(filterStr));
    }
    return this;
  }

  sort() {
    let sortStr;

    if (this.queryObj.sort) {
      sortStr = this.queryObj.sort.split(",").join(" ");
    } else {
      sortStr = "-createdAt";
    }

    this.query = this.query.sort(sortStr);
    return this
  }

  getFields() {
    let fieldStr;

    if (this.query.fields) {
      fieldStr = this.query.fields.split(",").join(" ");
    } else {
      fieldStr = "uniName status";
    }

    this.query = this.query.select(fieldStr);
    return this;
  }

  getPages() {
    let pages = 0;
    let limit = 0;

    if (this.query.pages) {
      pages = this.query.pages;
      limit = this.query.limit;
    }

    const toSkip = (pages - 1) * limit;
    this.query = this.query.skip(toSkip).limit(limit);
    return this;
  }
}

exports.getAllApplications = catchAsync(async function (req, res) {
  const query = applicationModel.find();
  const apiFeatures = new ApiFeatures(query, req.query);
  const allApplications = await apiFeatures
    .filter()
    .sort()
    .getFields()
    .getPages().query;

  res.status(200).json({
    status: "success",
    data: {
      allApplications,
    },
  });
});

exports.getApplication = catchAsync(async function (req, res) {
  const application = await applicationModel.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      application,
    },
  });
});

exports.updateApplication = catchAsync(async function (req, res) {
  const updatedApplication = await applicationModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  res.status(201).json({
    status: "success",
    data: {
      updatedApplication,
    },
  });
});

exports.createApplication = catchAsync(async function (req, res) {
  console.log(req.body);
  const newApplication = await applicationModel.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      newApplication,
    },
  });
});

exports.deleteApplication = catchAsync(async function (req, res) {
  const newApplication = await applicationModel.findByIdAndDelete(
    req.params.id,
  );

  res.status(201).json({
    status: "success",
    data: null,
  });
});
