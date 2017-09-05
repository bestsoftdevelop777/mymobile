import moment from "moment";
import COUNTRIES from "./countries";
import paClaimQuestions from "./paClaimQuestions";
import travelClaimQuestions from "./travelClaimQuestions";
import mobileClaimQuestions from "./mobileClaimQuestions";
export { paClaimQuestions, travelClaimQuestions, mobileClaimQuestions };

class ValidationResult {
  constructor(isValid, errMessage) {
    this.isValid = isValid;
    this.errMessage = errMessage;
  }
}

function validateNumber(num) {
  const isValid = true;
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid number"
  );
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const isValid = re.test(email);
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid email, e.g. hello@microassure.com"
  );
}

function validateDate(date) {
  const isValid = date instanceof Date;
  return new ValidationResult(isValid, isValid || "Please enter a valid date");
}

function notEmptyString(str) {
  const isValid = !/^\s*$/.test(str);
  return new ValidationResult(
    isValid,
    isValid || "You didn't type anything, please enter again."
  );
}

function validatePhoneNumber(phoneNumber) {
  const isValid = phoneNumber[0] === "8" || phoneNumber[0] === "9";
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid phone number"
  );
}

function validateImages(arr) {
  const isValid = true;
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid phone number"
  );
}

function validateBoolean(bool) {
  const isValid = typeof bool === "boolean";
  return new ValidationResult(
    isValid,
    isValid || "Please enter a valid option"
  );
}

function validateNRIC(str) {
  return new ValidationResult(true, true);
  if (str.length != 9)
    return new ValidationResult(false, "Please enter a valid NRIC/FIN");

  str = str.toUpperCase();

  var i,
    icArray = [];
  for (i = 0; i < 9; i++) {
    icArray[i] = str.charAt(i);
  }

  icArray[1] = parseInt(icArray[1], 10) * 2;
  icArray[2] = parseInt(icArray[2], 10) * 7;
  icArray[3] = parseInt(icArray[3], 10) * 6;
  icArray[4] = parseInt(icArray[4], 10) * 5;
  icArray[5] = parseInt(icArray[5], 10) * 4;
  icArray[6] = parseInt(icArray[6], 10) * 3;
  icArray[7] = parseInt(icArray[7], 10) * 2;

  var weight = 0;
  for (i = 1; i < 8; i++) {
    weight += icArray[i];
  }

  var offset = icArray[0] == "T" || icArray[0] == "G" ? 4 : 0;
  var temp = (offset + weight) % 11;

  var st = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
  var fg = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];

  var theAlpha;
  if (icArray[0] == "S" || icArray[0] == "T") {
    theAlpha = st[temp];
  } else if (icArray[0] == "F" || icArray[0] == "G") {
    theAlpha = fg[temp];
  }

  return new ValidationResult(icArray[8] === theAlpha, true);
}

function validateTravelStartDate(startDate) {
  // 2.  Trip Start date must be same as application date or after.
  // 3.  Trip Start date can be 182 days in advance of application Date
  startDate = moment(startDate);
  const applicationDate = moment(new Date());
  const dayDiff = startDate.diff(applicationDate, "days");
  if (dayDiff < 0) {
    return new ValidationResult(
      false,
      "Trip start date cannot be before application date."
    );
  } else if (dayDiff < 0 || dayDiff > 182) {
    return new ValidationResult(
      false,
      "Trip start date cannot be more than 182 days in advance."
    );
  }
  return new ValidationResult(true, true);
}

function validateTravelEndDate(endDate, answers) {
  // 1. Trip Period can't exceed for 182 days (Single Trip).
  endDate = moment(endDate);
  const startDate = answers.departureDate;
  const dayDiff = endDate.diff(startDate, "days");
  if (dayDiff > 182) {
    return new ValidationResult(false, "Trip period cannot exceed 182 days.");
  }
  return new ValidationResult(true, true);
}

function validateChoice(choice) {
  // const validChoice =
  //   choice.hasOwnProperty("label") && choice.hasOwnProperty("value");
  // return new ValidationResult(
  //   validChoice,
  //   "You have selected an invalid option"
  // );
  return new ValidationResult(true);
}

const TypeValidators = {
  email: validateEmail,
  string: notEmptyString,
  number: validateNumber,
  phoneNumber: validatePhoneNumber,
  images: validateImages,
  imageTable: () => new ValidationResult(true, true),
  date: validateDate,
  datetime: validateDate,
  travelStartDate: validateTravelStartDate,
  travelEndDate: validateTravelEndDate,
  choice: validateChoice,
  nric: validateNRIC,
  boolean: validateBoolean
};

export function validateAnswer(question, answer, answers) {
  const { responseType } = question;
  const responseTypes = [].concat(responseType);
  if (Array.isArray(question.id)) {
    // for (var i = 0; i < answer.length; i++) {
    //   const
    //   for (var j = 0; j < responseType.length; j++) {
    //     const res
    //   }
    //   validateFunc = TypeValidators[responseTypes[i]];
    //   response = validateFunc(answer);
    //   if (!response.isValid) return response;
    // }
    // return response;
    return new ValidationResult(true, true);
  }
  var validateFunc;
  for (var i = 0; i < responseTypes.length; i++) {
    validateFunc = TypeValidators[responseTypes[i]];
    response = validateFunc(answer, answers);
    if (!response.isValid) return response;
  }
  return response;
}

const claimIntro = [
  {
    question:
      "Welcome back <%= fullName %>, here are your protection plans. Which policy would you like to make a claim?",
    responseType: "number",
    id: "claimPolicyNo"
  }
];

export const QUESTION_SETS = {
  buy: [
    {
      question:
        "<%= ['Great choice 😄', 'Awesome choice 😄', 'Nice choice 😄', 'Ahh... our most popular choice 😘', 'Fantastic 😉'][Math.floor(Math.random()*5)] %>",
      responseType: null
    },
    {
      question:
        "I'll walk you through step-by-step. Let's start with the plan you prefer.",
      responseType: "number",
      exclude: ["mobile"],
      id: "planIndex"
    },
    {
      question: "Which country are you travelling to?",
      responseType: ["string"],
      choices: COUNTRIES,
      include: ["travel"],
      id: "travelDestination",
      searchOptions: {
        keys: ["label"],
        threshold: 0.2
      }
    },
    // {
    //   question: "Which region are you travelling to?",
    //   responseType: "string",
    //   responseType: ["string", "choice"],
    //   label: "SELECT DESTINATION",
    //   choices: [
    //     { label: "South East Asia", value: "ASEAN" },
    //     { label: "Asia", value: "Asia" },
    //     { label: "Worldwide", value: "Worldwide" }
    //   ],
    //   include: ["travel"],
    //   id: "travelDestination"
    // },
    {
      question: "When are you departing?",
      responseType: ["date", "travelStartDate"],
      futureOnly: true,
      id: "departureDate",
      include: ["travel"]
    },
    {
      question: "When are you returning?",
      responseType: ["date", "travelEndDate"],
      futureOnly: true,
      minDateFrom: "departureDate",
      id: "returnDate",
      include: ["travel"],
      defaultValue: "this.state.answers.departureDate"
    },
    {
      question: "Nice. Who do you want to insure?",
      responseType: ["string", "choice"],
      choices: [
        { label: "Myself", value: "applicant" },
        { label: "Me and my spouse", value: "spouse" },
        { label: "Me and my children", value: "children" },
        { label: "My family", value: "family" }
      ],
      id: "recipient",
      include: ["travel"]
    },

    {
      question: "How long do you want to be covered for?",
      responseType: "number",
      id: "coverageDuration",
      exclude: ["mobile", "travel"]
    },
    {
      question:
        "<%= ['Awesome', 'Nice', 'Great'][Math.floor(Math.random()*3)] %>. That would be $<%= (policy.plans[planIndex].premium * coverageDuration).toFixed(2) %>.",
      responseType: null,
      exclude: ["travel"]
    },
    {
      question:
        "For the next steps, I will be asking you some questions to get you covered instantly. Please be patient with my questions. 😬",
      responseType: null
    },
    {
      question: "May I know your full name?",
      responseType: ["string", "string"],
      id: ["firstName", "lastName"],
      labels: ["First name", "Last name"]
    },
    // {
    //   question: "May I know your first name?",
    //   responseType: "string",
    //   id: "firstName"
    // },
    // {
    //   question: "May I know your last name?",
    //   responseType: "string",
    //   id: "lastName"
    // },
    {
      question:
        "Nice to meet you <%= lastName %> <%= firstName %>! What's your NRIC/FIN/Passport?",
      responseType: ["string", "nric"],
      id: "NRIC"
    },
    {
      question: "What's your email address? ✉️",
      responseType: ["string", "email"],
      id: "email"
    },
    {
      question: "What's your mailing address?",
      responseType: "string",
      id: "address"
    },
    // {
    //   question: "As you are aware, I need your bank account for any future claims.",
    //   responseType: ["string", "string"],
    //   id: ["bankName", "bankAccountNumber"],
    //   labels: ["Bank name", "Bank account number"]
    // },
    {
      question:
        "Thank you <%= lastName %> <%= firstName %> for the information. I will now bring you to the confirmation page.",
      responseType: null
    }
  ],
  claim: claimIntro
};
