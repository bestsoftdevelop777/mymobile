// @flow
import Client from "ssh2-sftp-client";
import Parse from "parse/node";
import path from "path";
import fs from "fs";
import xlsx from "node-xlsx";
import Excel from "exceljs";

const BACKUP_DIR = "/ftp-response/Backup";
const CLAIMS_DIR = "/ftp-response/Claims";
const TRAVEL_CLAIMS = "TravelProtect360-Claims.xlsx";

export function connectToSFTP(sftp: any) {
  return sftp.connect({
    host: "103.13.129.149",
    port: "22",
    username: "sftpuser05",
    password: "xBFtSp9J:\\Pqs{=m"
  });
}

export function backupExistingFiles(sftp: any) {
  function recursivelyBackup(backupToPath, directory: string) {
    return sftp.list(directory).then(files => {
      let promises = [];
      files.forEach(file => {
        let promise;
        if (file.type === "d") {
          const newBackupPath = path.join(backupToPath, file.name);
          console.log("retrieve dir", newBackupPath);
          const recursive = true;
          promise = sftp.mkdir(newBackupPath, recursive).then(() => {
            const newFilePath = path.join(directory, file.name);
            console.log("created new dir", newFilePath);
            return recursivelyBackup(newBackupPath, newFilePath);
          });
        } else {
          const filePath = path.join(directory, file.name);
          console.log("retrieve file", filePath);
          promise = sftp.get(filePath).then(readStream => {
            const newBackupPath = path.join(backupToPath, file.name);
            console.log("created new file", newBackupPath);
            return sftp.put(readStream, newBackupPath);
          });
        }
        promises.push(promise);
      });
      return Promise.all(promises);
    });
  }

  return recursivelyBackup(BACKUP_DIR, CLAIMS_DIR);
}

export function appendClaimToExcelFile(sftp: any, claim: any) {
  const claimRow = transformClaimToExcelRow(claim);
  const filePath = path.join(
    __dirname,
    "..",
    "__tests__",
    "fixtures",
    TRAVEL_CLAIMS
  );
  // const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(filePath));
  // console.log(workSheetsFromBuffer[0].data);
  // return workSheetsFromBuffer;
  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(filePath).then(function() {
    console.log(workbook);
  });
  return;
}

export function transformClaimToExcelRow(claim) {
  const ClaimID = claim.id;
  const CreatedOnDate = claim.get("createdAt");
  const purchase = claim.get("purchase");
  const policyholder = purchase.get("user");
  const PolicyholderName =
    policyholder.get("lastName") + " " + policyholder.get("firstName");
  const PolicyNo = purchase.get("policyId");
  const PolicyholderIDType = purchase.get("policyholderIdType");
  const PolicyholderIDNo = purchase.get("policyholderIdNo");

  const isClaimByPolicyholder = claim.get("claimFromPolicyholder");
  let ClaimantName,
    ClaimantIDType,
    ClaimantIDNo,
    ClaimantPhone,
    ClaimantEmail,
    ClaimantAddress;

  if (isClaimByPolicyholder) {
    ClaimantName = PolicyholderName;
    ClaimantIDType = purchase.get("idNumberType");
    ClaimantIDNo = purchase.get("idNumber");
    ClaimantPhone = purchase.get("phoneNumber");
    ClaimantEmail = purchase.get("email");
    ClaimantAddress = purchase.get("address");
  } else {
    const claimantFirstName = claim.get("claimantFirstName");
    const claimantLastName = claim.get("claimantLastName");
    if (claimantFirstName && claimantLastName) {
      ClaimantName = claimantLastName + " " + claimantFirstName;
    }
    ClaimantIDType = claim.get("claimantIdType");
    ClaimantIDNo = claim.get("claimantIdNo");
    ClaimantPhone = claim.get("claimantPhone");
    ClaimantEmail = claim.get("claimantEmail");
    ClaimantAddress = claim.get("claimantAddress");
  }
  const AccidentPlace = claim.get("accidentLocation");
  const AccidentDate = claim.get("accidentDate");
  const AccidentType = claim.get("accidentType");
  const AccidentLongDesc = claim.get("details");
  const CurrencyType = claim.get("currencyType");
  const TotalAmount = claim.get("claimAmount");
  const SimilarCondition = claim.get("recurrenceDetail");

  let InsuranceCoInvolved = "";
  if (claim.get("hasOtherInsuranceCoverage")) {
    const otherInsuranceCo = claim.get("otherInsuranceCo");
    const otherPolicyNo = claim.get("otherPolicyNo");
    InsuranceCoInvolved = `Insurance compny: ${otherInsuranceCo}\nPolicy No: ${otherPolicyNo}`;
  }
  const documents = claim.get("documents") || [];
  const DocumentList = documents.map(d => `${d.name}.${d.ext}`).join("\n");

  const claimHeader = [
    "ClaimID",
    "CreatedOnDate",
    "PolicyholderName",
    "PolicyNo",
    "PolicyholderIDType",
    "PolicyholderIDNo",
    "ClaimantName",
    "ClaimantIDType",
    "ClaimantIDNo",
    "ClaimantPhone",
    "ClaimantEmail",
    "ClaimantAddress",
    "AccidentPlace",
    "AccidentDate",
    "AccidentType",
    "AccidentLongDesc",
    "CurrencyType",
    "TotalAmount",
    "Similar Condition & Recurrence",
    "Name Of Insurance Company(s) Involved",
    "Respect Of This Claim To",
    "DocumentList"
  ];
  const newClaimRow = [
    ClaimID,
    CreatedOnDate,
    PolicyholderName,
    PolicyNo,
    PolicyholderIDType,
    PolicyholderIDNo,
    ClaimantName,
    ClaimantIDType,
    ClaimantIDNo,
    ClaimantPhone,
    ClaimantEmail,
    ClaimantAddress,
    AccidentPlace,
    AccidentDate,
    AccidentType,
    AccidentLongDesc,
    CurrencyType,
    TotalAmount,
    SimilarCondition,
    InsuranceCoInvolved,
    ClaimantName,
    DocumentList
  ].map(r => r || "");
  return newClaimRow;
}
