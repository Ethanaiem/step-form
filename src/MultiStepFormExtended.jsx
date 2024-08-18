/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useMemo } from "react";
import {
  TextField,
  Button,
  Stepper,
  Typography,
  Grid,
  InputAdornment,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { LinearProgress } from "@mui/material";
import "react-phone-input-2/lib/style.css";
import dayjs from "dayjs";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LottieAnimation from "./LottieAnimation";
import {
  query,
  collection,
  where,
  getDocs,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase.config"; // Import the necessary Firestore methods

import "./MultiStepFormExtended.css";

const MultiStepFormExtended = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [businessEntity, setBusinessEntity] = useState(null);
  const [isSoleOwner, setIsSoleOwner] = useState(null);
  const [loanPurpose, setLoanPurpose] = useState("");
  const [ownershipPercentage, setOwnershipPercentage] = useState(100);
  const [addSecondOwner, setAddSecondOwner] = useState(false);
  const [secondOwnerFormData, setSecondOwnerFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
  });
  const [address, setAddress] = useState({
    unit: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [homeAddress, setHomeAddress] = useState({
    unit: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    console.log({ loanPurpose });
  }, [activeStep]);

  const [secondOwnerHomeAddress, setSecondOwnerHomeAddress] = useState({
    unit: "",
    street: "",
    city: "",
    state: "",
    zip: "",
  });
  const [fundingTime, setFundingTime] = useState("");
  const [isHomeBased, setIsHomeBased] = useState(null);
  const [registrationDate, setRegistrationDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [secondOwnerDOB, setSecondOwnerDOB] = useState(null);
  const [businessIndustry, setBusinessIndustry] = useState("");

  useEffect(() => {
    console.log({ businessEntity });
  }, [businessEntity]);

  const [taxDetails, setTaxDetails] = useState({ SSN: "", ITIN: "", EIN: "" });
  const [secondOwnerTaxDetails, setSecondOwnerTaxDetails] = useState({
    SSN: "",
    ITIN: "",
    EIN: "",
  });
  const steps = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
  ];
  const fundingOptions = [
    "Immediately",
    "1 - 2 Weeks",
    "30 Days",
    "More than 30 Days",
  ];
  // eslint-disable-next-line no-unused-vars
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    SSN: "",
    ITIN: "",
    EIN: "",
  });
  const location = useLocation();
  const [prevFormData, setPrevFormData] = useState(null);

  useEffect(() => {
    console.log({ "🚀": { taxDetails, loanPurpose, businessEntity } });
  }, [taxDetails, loanPurpose, businessEntity]);

  const totalSteps = useMemo(() => {
    if (isSoleOwner) {
      return 3;
    } else if (!addSecondOwner && ownershipPercentage > 50) {
      return 6;
    } else if (!addSecondOwner && ownershipPercentage < 51) {
      return 7;
    } else if (!isSoleOwner && addSecondOwner) {
      return 11;
    } else {
      return 11;
    }
  }, [isSoleOwner, addSecondOwner, !addSecondOwner, ownershipPercentage > 50]);
  // const progress = (activeStep / (totalSteps)) * 100;
  const [isLoading, setIsLoading] = useState(false);
  const [secondOwnerCreditScore, setSecondOwnerCreditScore] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    businessName: "",
    // agreement: ''
  });
  // Calculate progress
  const progress = useMemo(() => {
    const rawProgress = (activeStep / Math.max(totalSteps - 1, 1)) * 100;
    return Math.min(rawProgress, 100); // Ensures the progress does not exceed 100%
  }, [activeStep, totalSteps]);

  useEffect(() => {
    const data = location.state?.formData;
    setPrevFormData(data);
  }, []);

  const parseFirestoreTimestamp = (timestamp) => {
    return timestamp ? dayjs(new Date(timestamp.seconds * 1000)) : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = location.state?.formData?.email;
      if (email) {
        const q = query(
          collection(db, "loanApplications"),
          where("email", "==", email)
        );
        try {
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data(); // assuming only one document per email
            console.log(data, "Fetched data");

            // Set all states based on fetched data
            if (data.businessEntity) setBusinessEntity(data.businessEntity);
            if (data.address) setAddress(data.address);
            if (data.homeAddress) setHomeAddress(data.homeAddress);
            if (data.secondOwnerHomeAddress)
              setSecondOwnerHomeAddress(data.secondOwnerHomeAddress);
            if (data.secondOwnerFormData)
              setSecondOwnerFormData(data.secondOwnerFormData);
            if (data.EIN) setTaxDetails((prev) => ({ ...prev, EIN: data.EIN }));
            if (data.secondOwnerTaxDetails)
              setSecondOwnerTaxDetails({ SSN: data.secondOwnerTaxDetails });
            if (data.activeStep) setActiveStep(data.activeStep);
            if (data.monthlyRevenue)
              setPrevFormData((prev) => ({
                ...prev,
                monthlyRevenue: data.monthlyRevenue,
              }));
            if (data.SSN) setTaxDetails((prev) => ({ ...prev, SSN: data.SSN }));
            if (data.creditScore)
              setPrevFormData((prev) => ({
                ...prev,
                creditScore: data.creditScore,
              }));
            if (data.loanAmount)
              setPrevFormData((prev) => ({
                ...prev,
                loanAmount: data.loanAmount,
              }));
            if (data.ownershipPercentage)
              setOwnershipPercentage(data.ownershipPercentage);

            setIsSoleOwner(data.isSoleOwner);
            setLoanPurpose(data.loanPurpose);
            setAddSecondOwner(data.addSecondOwner);
            setIsHomeBased(data.isHomeBased);
            setFundingTime(data.fundingTime);
            setSecondOwnerCreditScore(data.secondOwnerCreditScore);
            // setActiveStep(data.activeStep)

            // Handle dates specifically
            if (data.registrationDate)
              setRegistrationDate(
                parseFirestoreTimestamp(data.registrationDate)
              );
            if (data.ownerOneDOB)
              setDateOfBirth(parseFirestoreTimestamp(data.ownerOneDOB));
            if (data.secondOwnerDOB)
              setSecondOwnerDOB(parseFirestoreTimestamp(data.secondOwnerDOB));
          } else {
            console.log("No documents forestore:");
          }
        } catch (error) {
          console.error("Error fetching data from Fiemail change", error);
        }
      }
    };
    fetchData();
  }, [location.state?.formData?.email]); // Dependency on und for the provided email."

  const handleNext = () => {
    if (activeStep < totalSteps) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleCreditScoreSelect = (score) => {
    setSecondOwnerCreditScore(score);
    handleNext();
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleBusinessEntitySelect = (e) => {
    console.log(9);
    const { value } = e.target;
    setBusinessEntity(value);
    // setBusinessEntity(entity);
    // handleNext();
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Ensure city and state fields only accept alphabets
    if (name === "city" || name === "state") {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // Ensure zip field only accepts 6-digit numbers
    if (name === "zip") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6); // Ensure it's a 6-digit number
    }

    setAddress({ ...address, [name]: formattedValue });
  };
  const handleInputChange = (setter, errorSetter) => (event) => {
    const { name, value } = event.target;
    let formattedValue = formatValue(value, name); // Format the input value
    setter((prevState) => ({ ...prevState, [name]: formattedValue }));

    // Regular expression patterns for SSN, ITIN, and EIN formats
    const itinPattern = /^\d{3}-\d{2}-\d{4}$/;
    const einPattern = /^\d{2}-\d{7}$/;
    const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;

    let errorMessage = "";

    // Validate ITIN format
    if (name === "ITIN" && !itinPattern.test(formattedValue)) {
      errorMessage = "Invalid ITIN format";
    }

    // Validate EIN format
    if (name === "EIN" && !einPattern.test(formattedValue)) {
      errorMessage = "Invalid EIN format";
    }
    if (name === "SSN" && !ssnPattern.test(formattedValue)) {
      errorMessage = "Invalid SSN format";
    }
    // Ensure city and state fields only accept alphabets
    if (name === "city" || name === "state") {
      formattedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    // Ensure zip field only accepts 6-digit numbers
    if (name === "zip") {
      formattedValue = value.replace(/\D/g, "").slice(0, 6); // Ensure it's a 6-digit number
    }
    // Set error message if format is invalid
    // errorSetter(prevState => ({ ...prevState, [name]: errorMessage }));
    setErrorMessages((prevState) => ({ ...prevState, [name]: errorMessage }));
  };

  const formatValue = (value, name) => {
    let formattedValue = value;

    if (name === "SSN" || name === "ITIN") {
      // Remove non-digit characters for ITIN
      formattedValue = formattedValue.replace(/\D/g, "");
      if (formattedValue.length > 9) {
        formattedValue = formattedValue.slice(0, 9);
      }
      if (formattedValue.length <= 3) {
        formattedValue = formattedValue;
      } else if (formattedValue.length <= 5) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          5
        )}`;
      } else {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          5
        )}-${formattedValue.slice(5, 9)}`;
      }
    } else if (name === "EIN") {
      // Remove non-digit characters for EIN
      formattedValue = formattedValue.replace(/\D/g, "");
      if (formattedValue.length > 9) {
        formattedValue = formattedValue.slice(0, 9);
      }
      if (formattedValue.length <= 2) {
        formattedValue = formattedValue;
      } else {
        formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(
          2,
          9
        )}`;
      }
    } else if (name === "SSN") {
      // Remove non-digit characters for SSN
      formattedValue = formattedValue.replace(/\D/g, "");
      if (formattedValue.length > 9) {
        formattedValue = formattedValue.slice(0, 9);
      }
      if (formattedValue.length <= 3) {
        formattedValue = formattedValue;
      } else if (formattedValue.length <= 5) {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          5
        )}`;
      } else {
        formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(
          3,
          5
        )}-${formattedValue.slice(5, 9)}`;
      }
    }

    return formattedValue;
  };

  const handleSecondInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecondOwnerFormData({
      ...secondOwnerFormData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleBusinessIndustryChange = (e) => {
    const { value } = e.target;
    setBusinessIndustry(value);
  };

  // const handleHomeBasedSelect = (value) => {
  //     setIsHomeBased(value);
  //     handleNext()
  // };
  const handleDateChange = (newValue) => {
    setRegistrationDate(newValue);
  };
  const handleDobDateChange = (newValue) => {
    setDateOfBirth(newValue);
    const now = dayjs();
    const dob = dayjs(newValue);
    const age = now.diff(dob, "year");

    if (age < 18) {
      setErrorMessage("User must be 18 years or above");
      setIsFormValid(false);
    } else {
      setErrorMessage("");
      setIsFormValid(true);
    }
  };
  const handleSecondDobDateChange = (newValue) => {
    setSecondOwnerDOB(newValue);
    const now = dayjs();
    const dob = dayjs(newValue);
    const age = now.diff(dob, "year");

    if (age < 18) {
      setErrorMessage("User must be 18 years or above");
      setIsFormValid(false);
    } else {
      setErrorMessage("");
      setIsFormValid(true);
    }
  };

  const handleLoanPurpose = (purpose) => {
    setLoanPurpose(purpose);
    handleNext();
  };

  const loanPurposes = [
    "Expand Business",
    "Import Goods",
    "Promote Business",
    "Purchase a vehicle",
    "Improve Cash Flow",
    "Purchase Equipment",
    "Pay Taxes",
    "Remodel Location",
    "Purchase Property",
    "Refinance an existing loan",
    "Purchase Inventory",
  ];

  const formatDate = (date) => {
    if (!date || date === 0) {
      return ""; // Return empty string if date is zero or invalid
    }
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading
    // Function to parse the monthly revenue string and extract the lower bound
    const parseMonthlyRevenue = (monthlyRevenue) => {
      if (monthlyRevenue.includes("-")) {
        return parseInt(monthlyRevenue.split("-")[0].replace(/[$,\s]/g, ""));
      } else if (monthlyRevenue.includes("Less than")) {
        return parseInt(monthlyRevenue.replace(/Less than [$,\s]/g, ""));
      } else if (monthlyRevenue.includes("+")) {
        return parseInt(monthlyRevenue.replace(/[$,\s\+]/g, ""));
      }
      return parseInt(monthlyRevenue.replace(/[$,\s]/g, ""));
    };

    const monthlyRevenue =
      location.state.monthlyRevenue || prevFormData.monthlyRevenue; // Assuming this is the selected revenue string
    const annualRevenue = parseMonthlyRevenue(monthlyRevenue) * 12;
    console.log(annualRevenue, "annual Revenue");

    const ownerOnePercentage = ownershipPercentage
      ? ownershipPercentage.toString()
      : "";
    const ownerTwoPercentage =
      secondOwnerFormData && ownershipPercentage !== undefined
        ? (100 - ownershipPercentage).toString()
        : "";
    // Debugging outputs
    console.log("Ownership Percentage:", ownershipPercentage);
    console.log("Second Owner Form Data:", secondOwnerFormData);
    console.log("Owner One Percentage:", ownerOnePercentage);
    console.log("Owner Two Percentage:", ownerTwoPercentage);

    const formData = {
      owner_one_name: prevFormData.firstName + prevFormData.lastName,
      owner_one_email: prevFormData.email,
      business_contact: prevFormData.contactNumber.toString() || "1234",
      owner_one_contact: prevFormData.contactNumber.toString(),
      owner_one_dob: formatDate(dateOfBirth),
      owner_one_ssn: taxDetails.SSN?.toString(),
      owner_one_percentage:
        ownershipPercentage !== undefined
          ? ownershipPercentage?.toString()
          : "",
      owner_one_address:
        homeAddress.unit +
        homeAddress.street +
        homeAddress.city +
        homeAddress.state,
      owner_one_city: homeAddress.city,
      owner_one_state: homeAddress.state,
      owner_one_zip: homeAddress.zip.toString(),
      owner_one_cs: prevFormData.creditScore,
      owner_two_name:
        secondOwnerFormData.firstName + secondOwnerFormData.lastName,
      owner_two_email: secondOwnerFormData.email,
      owner_two_contact: secondOwnerFormData.contactNumber?.toString(),
      owner_two_dob: formatDate(secondOwnerDOB),
      owner_two_ssn: secondOwnerTaxDetails?.SSN.toString(),
      owner_two_percentage:
        ownershipPercentage !== 100 && addSecondOwner == true
          ? (100 - ownershipPercentage)?.toString()
          : "",
      owner_two_address:
        secondOwnerHomeAddress.unit +
        secondOwnerHomeAddress.street +
        secondOwnerHomeAddress.city +
        secondOwnerHomeAddress.state,
      owner_two_city: secondOwnerHomeAddress.city,
      owner_two_state: secondOwnerHomeAddress.state,
      owner_two_zip: secondOwnerHomeAddress.zip?.toString(),
      owner_two_cs:
        secondOwnerCreditScore !== undefined
          ? secondOwnerCreditScore?.toString()
          : "",
      business_address:
        address.unit + address.street + address.city + address.state,
      business_city: address.city,
      business_state: address.state,
      business_zip: address.zip.toString(),
      business_entity: businessEntity,
      business_start_date: formatDate(registrationDate),
      use_of_loan: loanPurpose,
      company_name: prevFormData.businessName,
      loan_amount:
        location.state.loanAmount.toString() || prevFormData.loanAmount,
      annual_revenue: annualRevenue.toString(),
      business_ein: taxDetails.EIN.toString(),
      business_number: prevFormData.contactNumber,
      business_industry: businessIndustry.toString(),
    };

    if (secondOwnerDOB !== 0) {
      // Only include if secondOwnerDOB is not zero
      formData.owner_two_dob = formatDate(secondOwnerDOB);
    }
    e.preventDefault();
    try {
      // 'https://us-central1-ethan-klendify.cloudfunctions.net/api/form'
      const response = await axios.post(
        "https://us-central1-ethan-klendify.cloudfunctions.net/api/form",
        formData,
        { withCredentials: true }
      );
      // window.location.href = response.data.url; // Redirect to the DocuSign signing ceremony
      const { url } = response.data;

      window.location.href = url;
    } catch (error) {
      console.error("Error submitting form", error);
    } finally {
      setIsLoading(false); // End loading whether successful or not
    }
  };

  const handlePhoneInputChange = (event) => {
    const input = event.target.value.replace(/\D/g, ""); // Remove non-digit characters
    let formattedInput = "";
    let errorMessage = "";

    // Break the string into parts and format
    if (input.length > 0) {
      formattedInput += `(${input.substring(0, 3)}`; // Area code
    }
    if (input.length >= 4) {
      formattedInput += `) ${input.substring(3, 6)}`; // Prefix
    }
    if (input.length > 6) {
      formattedInput += `-${input.substring(6, 10)}`; // Line number
    }

    // Validate phone number length
    if (input.length < 10) {
      errorMessage = "Complete phone number required";
    }

    // Update state
    setSecondOwnerFormData({
      ...secondOwnerFormData,
      contactNumber: formattedInput,
    });

    // Set or clear error message
    setErrors({
      ...errors,
      contactNumber: errorMessage,
    });
  };

  const validatePhoneInputOnBlur = () => {
    const errorMessage =
      secondOwnerFormData.contactNumber.length < 14
        ? "Complete phone number required"
        : "";
    setErrors({
      ...errors,
      contactNumber: errorMessage,
    });
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return (
          address.city &&
          address.state &&
          address.street &&
          address.unit &&
          address.zip &&
          taxDetails.EIN &&
          !errorMessages.EIN &&
          businessEntity &&
          businessIndustry &&
          registrationDate
        );
      case 3:
        return (
          homeAddress.city &&
          homeAddress.state &&
          homeAddress.street &&
          homeAddress.unit &&
          homeAddress.zip &&
          //   taxDetails.SSN &&

          dateOfBirth &&
          !errorMessage
        );
      case 4:
        return dateOfBirth && !errorMessage;
      // case 6:
      //     return taxDetails.EIN && !errorMessages.EIN && (taxDetails.SSN || taxDetails.ITIN) && !errorMessages.SSN && !errorMessages.ITIN;
      case 10:
        return (
          secondOwnerHomeAddress.city &&
          secondOwnerHomeAddress.state &&
          secondOwnerHomeAddress.street &&
          secondOwnerHomeAddress.unit &&
          secondOwnerHomeAddress.zip
          //   && secondOwnerTaxDetails.SSN &&
          //  !errorMessages.SSN
        );
      case 9:
        return (
          secondOwnerFormData.firstName &&
          secondOwnerFormData.lastName &&
          secondOwnerFormData.email &&
          secondOwnerFormData.contactNumber
        );
      case 11:
        return secondOwnerDOB && !errorMessage;
      default:
        return false;
    }
  };

  const updateFirestoreField = async (field, value) => {
    const email =
      location.state?.formData?.email || localStorage.getItem("email");
    if (email && value !== null) {
      let updates = { [field]: value };
      // Convert Day.js date to Firestore Timestamp if necessary
      if (
        field === "registrationDate" ||
        field === "ownerOneDOB" ||
        field === "secondOwnerDOB"
      ) {
        updates[field] = Timestamp.fromDate(new Date(value.toISOString()));
      }

      try {
        const querySnapshot = await getDocs(
          query(collection(db, "loanApplications"), where("email", "==", email))
        );
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, updates);
          console.log(`${field} updated in Firestore.`);
        }
      } catch (error) {
        console.error(`Error updating ${field} in Firestore:`, error);
      }
    }
  };

  useEffect(() => {
    if (businessEntity !== null && businessEntity !== "") {
      // Only run the update if businessEntity has been set
      console.log("runningggggggggggg");
      updateFirestoreField("businessEntity", businessEntity);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [businessEntity]);

  useEffect(() => {
    if (isStepValid(1)) {
      // Only run the update if businessEntity has been set
      console.log("runningggggggggggg");
      updateFirestoreField("address", address);
      updateFirestoreField("EIN", taxDetails.EIN);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [address, taxDetails.EIN]);

  useEffect(() => {
    if (isHomeBased !== null && isHomeBased !== undefined) {
      // Only run the update if businessEntity has been set
      updateFirestoreField("isHomebased", isHomeBased);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [isHomeBased]);

  useEffect(() => {
    if (registrationDate !== null) {
      console.log("registration date");
      updateFirestoreField("registrationDate", registrationDate);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [registrationDate]);

  useEffect(() => {
    if (!isStepValid()) {
      updateFirestoreField("homeAddress", homeAddress);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [homeAddress]);
  useEffect(() => {
    if (dateOfBirth !== null) {
      updateFirestoreField("ownerOneDOB", dateOfBirth);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [dateOfBirth]);

  useEffect(() => {
    if (isSoleOwner !== null) {
      updateFirestoreField("isSoleOwner", isSoleOwner);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [isSoleOwner]);

  useEffect(() => {
    if (loanPurpose !== null && loanPurpose !== "") {
      updateFirestoreField("loanPurpose", loanPurpose);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [loanPurpose]);

  useEffect(() => {
    if (fundingTime !== null && fundingTime !== "") {
      updateFirestoreField("fundingTime", fundingTime);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [fundingTime]);

  useEffect(() => {
    if (ownershipPercentage !== null && ownershipPercentage !== 0) {
      updateFirestoreField("ownershipPercentage", ownershipPercentage);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [ownershipPercentage]);

  useEffect(() => {
    if (addSecondOwner !== null && addSecondOwner == true) {
      updateFirestoreField("addSecondOwner", addSecondOwner);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [addSecondOwner]);

  useEffect(() => {
    if (isStepValid(9)) {
      updateFirestoreField("secondOwnerFormData", secondOwnerFormData);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [secondOwnerFormData]);

  useEffect(() => {
    if (isStepValid(10)) {
      updateFirestoreField("secondOwnerHomeAddress", secondOwnerHomeAddress);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [secondOwnerHomeAddress]);

  useEffect(() => {
    if (secondOwnerDOB !== null) {
      updateFirestoreField("secondOwnerDOB", secondOwnerDOB);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [secondOwnerDOB]);
  useEffect(() => {
    if (isStepValid(11)) {
      updateFirestoreField("secondOwnerDOB", secondOwnerDOB);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [secondOwnerDOB]);
  useEffect(() => {
    if (
      secondOwnerTaxDetails.SSN !== null &&
      secondOwnerTaxDetails.SSN !== ""
    ) {
      updateFirestoreField("secondOwnerTaxDetails", secondOwnerTaxDetails.SSN);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [secondOwnerTaxDetails.SSN]);

  useEffect(() => {
    if (secondOwnerCreditScore !== null && secondOwnerCreditScore !== "") {
      updateFirestoreField("secondOwnerCreditScore", secondOwnerCreditScore);
      updateFirestoreField("activeStep", activeStep);
    }
  }, [secondOwnerCreditScore]);

  useEffect(() => {
    if (isStepValid(3)) {
      updateFirestoreField("homeAddress", homeAddress);
      updateFirestoreField("SSN", taxDetails.SSN); // Ensure SSN is updated in Firestore
      updateFirestoreField("activeStep", activeStep);
    }
  }, [homeAddress, taxDetails.SSN]);

  useEffect(() => {
    setIsFormValid(isStepValid(activeStep));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxDetails, errorMessages, activeStep, errorMessage]);

  return (
    <div className="form-container">
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        className="stepper"
      ></Stepper>
      {!isLoading && (
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              mt: 2,
              mb: 2,
              flex: 1,
              marginRight: "10px",
              height: "10px",
              borderRadius: "20px",
            }}
          />
          <span>{`${Math.round(progress)}%`}</span>
        </div>
      )}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "300px",
          }}
        >
          <LottieAnimation />
        </div>
      ) : (
        <>
          {/*  Business Info - was steps 0-3 - now 0*/}

          {activeStep === 0 && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Business Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Please Enter your business details
              </Typography>

              <Grid
                container
                columnSpacing={2}
                className="grid-container grid-layout"
              >
                {Object.keys(address).map((key) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={address[key]}
                      onChange={handleAddressChange}
                      fullWidth
                      margin="normal"
                      required
                      inputProps={{
                        pattern:
                          key === "zip"
                            ? "\\d{6}"
                            : key === "city" || key === "state"
                            ? "^[a-zA-Z]+$"
                            : undefined,
                        title:
                          key === "zip"
                            ? "Zip code should be 6 digits"
                            : key === "city" || key === "state"
                            ? "Only alphabets are allowed"
                            : undefined,
                      }}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} style={{ marginTop: "16px" }}>
                  <TextField
                    label="EIN"
                    variant="outlined"
                    name="EIN"
                    value={taxDetails.EIN}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          sx={{ marginTop: 3, cursor: "pointer" }}
                          title="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
                        >
                          <InfoIcon
                            sx={{ marginLeft: 1, padding: 0 }}
                            fontSize="small"
                          />
                        </Tooltip>
                      ),
                    }}
                    onChange={handleInputChange(
                      setTaxDetails,
                      setErrorMessages
                    )}
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} marginTop={-1}>
                <Grid xs={12} sm={6} item>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Business Entity *
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      align="left"
                      required
                      value={businessEntity}
                      label="Business Entity *"
                      onChange={handleBusinessEntitySelect}
                    >
                      <MenuItem value="LLC">LLC</MenuItem>
                      <MenuItem value="Sole Proprietorship">
                        Sole Proprietorship
                      </MenuItem>
                      <MenuItem value="Partnership">Partnership</MenuItem>
                      <MenuItem value="Non-Profit">Non-Profit</MenuItem>
                      <MenuItem value="C Corporation">C Corporation</MenuItem>
                      <MenuItem value="S Corporation">S Corporation</MenuItem>
                      <MenuItem value="Professional Corporation">
                        Professional Corporation
                      </MenuItem>
                      <MenuItem value="I haven't registered it yet">{`I haven't registered it yet`}</MenuItem>
                      <MenuItem value="I am not sure">I am not sure</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} sm={6} item>
                  <TextField
                    label="Business Industry"
                    variant="outlined"
                    name="business_industry"
                    fullWidth
                    value={businessIndustry}
                    onChange={handleBusinessIndustryChange}
                    required
                  />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      sx={{ width: "100%" }}
                      label="Registration date"
                      fullWidth
                      value={registrationDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              <div className="step-navigation">
                <Button
                  sx={{ marginLeft: "auto" }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("homeAddress", "SSN")}
                  className="next-button"
                  disabled={!isStepValid(1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/*  Pesronal Info - was step 4 - now 1*/}
          {activeStep === 1 && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Personal Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Please Enter your personal details
              </Typography>
              <Grid
                container
                columnSpacing={2}
                className="grid-layout grid-container"
              >
                {Object.entries(homeAddress).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={value}
                      onChange={handleInputChange(
                        setHomeAddress,
                        setErrorMessages
                      )}
                      fullWidth
                      margin="normal"
                      required
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} style={{ marginTop: "16px" }}>
                  <TextField
                    //  error={!!errorMessages.SSN}
                    label="SSN"
                    variant="outlined"
                    name="SSN"
                    value={taxDetails.SSN}
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          sx={{ marginTop: 3, cursor: "pointer" }}
                          title="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
                        >
                          <InfoIcon
                            sx={{ marginLeft: 1, padding: 0 }}
                            fontSize="small"
                          />
                        </Tooltip>
                      ),
                    }}
                    onChange={handleInputChange(
                      setTaxDetails,
                      setErrorMessages
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} style={{ marginTop: "16px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      sx={{ width: "100%" }}
                      label="Date of birth"
                      name="dateOfBirth"
                      fullWidth
                     
                      value={dateOfBirth}
                      onChange={handleDobDateChange}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <Box sx={{ marginLeft: -4, marginTop: 1 }}>
                    {errorMessage && (
                      <Typography variant="body2" color="error" align="center">
                        {errorMessage}
                      </Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>

              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("homeAddress", "SSN")}
                  className="next-button"
                  disabled={!isStepValid(3)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Was step 6 - now 2 */}

          {activeStep === 2 && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Business Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Are you the sole owner?
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    className={`home-based-button ${
                      isSoleOwner === true ? "selected" : ""
                    }`}
                    fullWidth
                    onClick={() => setIsSoleOwner(true)}
                  >
                    Yes
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    fullWidth
                    className={`home-based-button ${
                      isSoleOwner === false ? "selected" : ""
                    }`}
                    onClick={() => setIsSoleOwner(false)}
                  >
                    No
                  </Button>
                </Grid>
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>

                {isSoleOwner === true ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    className="next-button"
                    disabled={isSoleOwner === null}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleNext("soleOwner")}
                    className="next-button"
                    disabled={isSoleOwner === null}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Was step 7 - now 3 */}

          {activeStep === 3 && !isSoleOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Ownership Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                What percentage of ownership do you have?
              </Typography>
              <Typography gutterBottom>
                Enter Ownership Percentage (0-100%)
              </Typography>
              <TextField
                type="number"
                value={ownershipPercentage}
                onChange={(e) => {
                  const value = e.target.value; // Capture the string value from the input
                  const numericValue = parseInt(value); // Convert the string to a number
                  if (value === "") {
                    setOwnershipPercentage(""); // Allow the field to be empty
                  } else if (
                    !isNaN(numericValue) &&
                    numericValue >= 0 &&
                    numericValue <= 100
                  ) {
                    setOwnershipPercentage(numericValue); // Update only if the value is between 0 and 100
                  }
                }}
                label="Ownership Percentage"
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: { min: 0, max: 100 },
                }}
              />
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("ownership")}
                  className="next-button"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Was step 8 - now 4 */}

          {activeStep === 4 && !isSoleOwner && ownershipPercentage > 50 && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Business Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                What do you need the money for?
              </Typography>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                className="grid-container"
              >
                {loanPurposes.map((purpose) => (
                  <Grid item xs={6} sm={6} key={purpose}>
                    <Button
                      variant={
                        loanPurpose === purpose ? "contained" : "outlined"
                      }
                      onClick={() => handleLoanPurpose(purpose)}
                      fullWidth
                    >
                      {purpose}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                {/* <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!loanPurpose}>
                            Next
                        </Button> */}
              </div>
            </div>
          )}

          {/* Was step 9 - now 5 */}

          {activeStep === 5 && !isSoleOwner && ownershipPercentage > 50 && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Business Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                When do you need the money?
              </Typography>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                className="grid-container"
              >
                {fundingOptions.map((option) => (
                  <Grid item xs={6} sm={6} key={option}>
                    <Button
                      variant={
                        fundingTime === option ? "contained" : "outlined"
                      }
                      onClick={() => setFundingTime(option)}
                      fullWidth
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className="next-button"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}

          {/*  changes in this step start  */}
          {/* Was step 8 - now 4 */}

          {activeStep === 4 && !isSoleOwner && ownershipPercentage < 51 && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Do you want to add a second owner?
              </Typography>
              <Typography sx={{ marginBottom: 2 }}>
                Add second owner if your ownership is less than 51%
              </Typography>
              <Grid container spacing={2} justifyContent="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    className={`home-based-button ${
                      addSecondOwner === true ? "selected" : ""
                    }`}
                    onClick={() => setAddSecondOwner(true)}
                  >
                    Yes
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    className={`home-based-button ${
                      addSecondOwner === false ? "selected" : ""
                    }`}
                    onClick={() => setAddSecondOwner(false)}
                  >
                    No
                  </Button>
                </Grid>
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("addSecondOwner")}
                  className="next-button"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {/* changes in this step end */}
          {/* Business Information  */}
          {/* Was step 9 - now 5 */}

          {activeStep === 5 &&
            !isSoleOwner &&
            !addSecondOwner &&
            ownershipPercentage < 51 && (
              <div className="step-content">
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  className="step-title"
                >
                  Business Information
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  className="step-title-mini"
                >
                  What do you need the money for?
                </Typography>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={2}
                  className="grid-container"
                >
                  {loanPurposes.map((purpose) => (
                    <Grid item xs={6} sm={6} key={purpose}>
                      <Button
                        variant={
                          loanPurpose === purpose ? "contained" : "outlined"
                        }
                        onClick={() => handleLoanPurpose(purpose)}
                        fullWidth
                      >
                        {purpose}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <div className="step-navigation">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBack}
                    className="back-button"
                  >
                    Back
                  </Button>
                  {/* <Button variant="contained" color="primary" onClick={() => handleNext('purpose')} className="next-button" disabled={!loanPurpose}>
                                    Next
                                </Button> */}
                </div>
              </div>
            )}
          {/* Business Information  */}
          {/* this new step submission  is added start */}
          {/* Was step 10 - now 6 */}

          {activeStep === 6 &&
            !isSoleOwner &&
            !addSecondOwner &&
            ownershipPercentage < 51 && (
              <div className="step-content">
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  className="step-title"
                >
                  Business Information
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  className="step-title-mini"
                >
                  When do you need the money?
                </Typography>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={2}
                  className="grid-container"
                >
                  {fundingOptions.map((option) => (
                    <Grid item xs={6} sm={6} key={option}>
                      <Button
                        variant={
                          fundingTime === option ? "contained" : "outlined"
                        }
                        onClick={() => setFundingTime(option)}
                        fullWidth
                      >
                        {option}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <div className="step-navigation">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBack}
                    className="back-button"
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    className="next-button"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          {/* this new step submission is added end */}
          {/* this step changes from 10 to 9  remove !addSecondOwner */}
          {/* Was step 10 - now 6 */}

          {activeStep === 6 &&
            !isSoleOwner &&
            !addSecondOwner &&
            ownershipPercentage > 50 && (
              <div className="step-content">
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  className="step-title"
                >
                  Business Information
                </Typography>
                <Typography
                  variant="h5"
                  align="center"
                  gutterBottom
                  className="step-title-mini"
                >
                  What do you need the money for?
                </Typography>
                <Grid
                  container
                  rowSpacing={2}
                  columnSpacing={2}
                  className="grid-container"
                >
                  {loanPurposes.map((purpose) => (
                    <Grid item xs={6} sm={6} key={purpose}>
                      <Button
                        variant={
                          loanPurpose === purpose ? "contained" : "outlined"
                        }
                        onClick={() => handleLoanPurpose(purpose)}
                        fullWidth
                      >
                        {purpose}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                <div className="step-navigation">
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleBack}
                    className="back-button"
                  >
                    Back
                  </Button>
                  {/* <Button variant="contained" color="primary" onClick={() => handleNext('purpose')} className="next-button" disabled={!loanPurpose}>
                                    Next
                                </Button> */}
                </div>
              </div>
            )}
          {/* this step changes from 10 to 9 */}

          {/* Was step 11 - now 7 */}

          {activeStep === 7 && !isSoleOwner && !addSecondOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Business Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                When do you need the money?
              </Typography>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                className="grid-container"
              >
                {fundingOptions.map((option) => (
                  <Grid item xs={6} sm={6} key={option}>
                    <Button
                      variant={
                        fundingTime === option ? "contained" : "outlined"
                      }
                      onClick={() => setFundingTime(option)}
                      fullWidth
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className="next-button"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
          {/* Was step 9 - now 5 */}

          {activeStep === 5 && !isSoleOwner && addSecondOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Second Owner Personal Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Please Input Second Owner information
              </Typography>

              <Grid container columnSpacing={2} className="grid-layout">
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={secondOwnerFormData.firstName}
                    onChange={handleSecondInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={secondOwnerFormData.lastName}
                    onChange={handleSecondInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email Address"
                    name="email"
                    value={secondOwnerFormData.email}
                    onChange={handleSecondInputChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contact Number"
                    name="contactNumber"
                    value={secondOwnerFormData.contactNumber}
                    onChange={handlePhoneInputChange}
                    fullWidth
                    margin="normal"
                    onBlur={validatePhoneInputOnBlur} // Validate on blur
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    inputProps={{
                      maxLength: 14, // Limit input length to fit formatted number
                    }}
                  />
                </Grid>
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("secondOwnerData")}
                  className="next-button"
                  disabled={!isStepValid(9)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {/* Was step 10 - now 6 */}

          {activeStep === 6 && !isSoleOwner && addSecondOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Second Owner Personal Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Please Enter Second Owner Home Address
              </Typography>
              <Grid container columnSpacing={2} className="grid-layout">
                {Object.entries(secondOwnerHomeAddress).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <TextField
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      name={key}
                      value={value}
                      onChange={handleInputChange(setSecondOwnerHomeAddress)}
                      fullWidth
                      margin="normal"
                      required
                      inputProps={{
                        pattern:
                          key === "zip"
                            ? "\\d{6}"
                            : key === "city" || key === "state"
                            ? "^[a-zA-Z]+$"
                            : undefined,
                        title:
                          key === "zip"
                            ? "Zip code should be 6 digits"
                            : key === "city" || key === "state"
                            ? "Only alphabets are allowed"
                            : undefined,
                      }}
                    />
                  </Grid>
                ))}

                <Grid item xs={12} sm={6} style={{ marginTop: "16px" }}>
                  <TextField
                    //    error={!!errorMessages.SSN}
                    label="SSN"
                    variant="outlined"
                    name="SSN"
                    InputProps={{
                      endAdornment: (
                        <Tooltip
                          sx={{ marginTop: 3, cursor: "pointer" }}
                          title="Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit."
                        >
                          <InfoIcon
                            sx={{ marginLeft: 1, padding: 0 }}
                            fontSize="small"
                          />
                        </Tooltip>
                      ),
                    }}
                    value={secondOwnerTaxDetails.SSN}
                    onChange={handleInputChange(
                      setSecondOwnerTaxDetails,
                      setErrorMessages
                    )}
                    fullWidth
                  />
                </Grid>
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    handleNext("secondOwnerHomeAddress", "secondOwnerSSN")
                  }
                  className="next-button"
                  disabled={!isStepValid(10)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {/* Was step 11 - now 7 */}

          {activeStep === 7 && !isSoleOwner && addSecondOwner && (
            <div className="step-content-date">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Second Owner Personal Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Please Enter Second Owner Date of Birth
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  sx={{ width: "100%" }}
                  label="Date"
                  name="secondOwnerDOB"
                  value={secondOwnerDOB}
                  onChange={(newValue) => handleSecondDobDateChange(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {errorMessage && (
                <Typography variant="body2" color="error" align="center">
                  {errorMessage}
                </Typography>
              )}
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                  style={{
                    padding: "18px 32px",
                    fontSize: "16px",
                    borderRadius: "8px",
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("secondOwnerDOB")}
                  className="next-button"
                  disabled={!isStepValid(11)}
                  style={{
                    padding: "18px 32px",
                    fontSize: "16px",
                    borderRadius: "8px",
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {/* Was step 12 - now 8 */}

          {activeStep === 8 && !isSoleOwner && addSecondOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title"
              >
                Second Owner Personal Information
              </Typography>
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                Please Select Second Onwer Credit Score
              </Typography>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                className="grid-container"
              >
                {[
                  "500 and Below",
                  "500 - 549",
                  "550 - 599",
                  "600 - 649",
                  "650 - 719",
                  "720 or Above",
                  "Not Sure",
                ].map((score) => (
                  <Grid item xs={6} sm={6} key={score}>
                    <Button
                      variant="outlined"
                      fullWidth
                      className={`time-period-button ${
                        secondOwnerCreditScore === score ? "selected" : ""
                      }`}
                      onClick={() => handleCreditScoreSelect(score)}
                    >
                      {score}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                {/* <Button variant="contained" color="primary" onClick={handleNext('')} className="next-button" disabled={!secondOwnerCreditScore}>
                                    Next
                                </Button> */}
              </div>
            </div>
          )}
          {/* Was step 13 - now 9 */}

          {activeStep === 9 && !isSoleOwner && addSecondOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                What do you need the money for?
              </Typography>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                className="grid-container"
              >
                {loanPurposes.map((purpose) => (
                  <Grid item xs={6} sm={6} key={purpose}>
                    <Button
                      variant={
                        loanPurpose === purpose ? "contained" : "outlined"
                      }
                      onClick={() => handleLoanPurpose(purpose)}
                      fullWidth
                    >
                      {purpose}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleNext("purpose")}
                  className="next-button"
                  disabled={!loanPurpose}
                >
                  NEXT
                </Button>
              </div>
            </div>
          )}
          {/* Was step 14 - now 10 */}

          {activeStep === 10 && !isSoleOwner && addSecondOwner && (
            <div className="step-content">
              <Typography
                variant="h5"
                align="center"
                gutterBottom
                className="step-title-mini"
              >
                When do you need the money?
              </Typography>
              <Grid
                container
                rowSpacing={2}
                columnSpacing={2}
                className="grid-container"
              >
                {fundingOptions.map((option) => (
                  <Grid item xs={6} sm={6} key={option}>
                    <Button
                      variant={
                        fundingTime === option ? "contained" : "outlined"
                      }
                      onClick={() => setFundingTime(option)}
                      fullWidth
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <div className="step-navigation">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleBack}
                  className="back-button"
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className="next-button"
                >
                  Submit
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default MultiStepFormExtended;
