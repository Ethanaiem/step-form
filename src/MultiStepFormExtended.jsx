import { useEffect, useState } from 'react';
import { TextField, Button, Stepper, Step, StepLabel, Typography, Grid, Slider, Checkbox, FormControlLabel } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PhoneInput from 'react-phone-input-2';
import { LinearProgress } from '@mui/material';
import 'react-phone-input-2/lib/style.css';
import InputMask from 'react-input-mask';
import dayjs from 'dayjs';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import './MultiStepFormExtended.css';
import secureImage from './assets/secure.png';
import trustedImage from './assets/trusted.png';

const MultiStepFormExtended = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [businessEntity, setBusinessEntity] = useState('');
    const [isSoleOwner, setIsSoleOwner] = useState(null);
    const [loanPurpose, setLoanPurpose] = useState('');
    const [ownershipPercentage, setOwnershipPercentage] = useState(0); // Default to 50% for demo
    const [addSecondOwner, setAddSecondOwner] = useState(false);
    const [secondOwnerFormData, setSecondOwnerFormData] = useState({ firstName: '', lastName: '', email: '', contactNumber: '', agreement: false, });
    const [address, setAddress] = useState({ unit: '', street: '', city: '', state: '', zip: '' });
    const [homeAddress, setHomeAddress] = useState({ unit: '', street: '', city: '', state: '', zip: '' });
    const [secondOwnerHomeAddress, setSecondOwnerHomeAddress] = useState({ unit: '', street: '', city: '', state: '', zip: '' });
    const [fundingTime, setFundingTime] = useState('');
    const [isHomeBased, setIsHomeBased] = useState(null);
    const [registrationDate, setRegistrationDate] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [secondOwnerDOB, setSecondOwnerDOB] = useState(null)
    const [taxDetails, setTaxDetails] = useState({ SSN: '', ITIN: '', EIN: '' });
    const [secondOwnerTaxDetails, setSecondOwnerTaxDetails] = useState({ SSN: '', ITIN: '', EIN: '' });
    const steps = ['1', '2', '3', '4', '5', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
    const fundingOptions = ["Immediately", "1 - 2 Weeks", "30 Days", "More than 30 Days"];
    // eslint-disable-next-line no-unused-vars
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState({ SSN: '', ITIN: '', EIN: '' });
    const location = useLocation();
    const [prevFormData, setPrevFormData] = useState(null)
    const totalSteps = steps.length;
    const progress = (activeStep / (totalSteps - 1)) * 100;
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        const data = location.state?.formData
        setPrevFormData(data)
    }, [])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => {
            if (prevActiveStep === 5) {
                return prevActiveStep + 2;
            }
            return prevActiveStep + 1;
        });
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handlePhoneChange = (value) => {
        setSecondOwnerFormData({
            ...secondOwnerFormData,
            contactNumber: value,
        });
    };
    const handleBusinessEntitySelect = (entity) => {
        setBusinessEntity(entity);
        handleNext()
    };
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress({ ...address, [name]: value, });
    };

    const handleInputChange = (setter, errorSetter) => (event) => {
        const { name, value } = event.target;
        const formattedValue = formatValue(value, name); // Format the input value
        setter(prevState => ({ ...prevState, [name]: formattedValue }));

        // Regular expression patterns for SSN, ITIN, and EIN formats
        const ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
        const itinPattern = /^\d{3}-\d{2}-\d{4}$/;
        const einPattern = /^\d{2}-\d{7}$/;

        let errorMessage = '';

        // Validate SSN format
        if (name === 'SSN' && !ssnPattern.test(formattedValue)) {
            errorMessage = 'Invalid SSN format';
        }

        // Validate ITIN format
        if (name === 'ITIN' && !itinPattern.test(formattedValue)) {
            errorMessage = 'Invalid ITIN format';
        }

        // Validate EIN format
        if (name === 'EIN' && !einPattern.test(formattedValue)) {
            errorMessage = 'Invalid EIN format';
        }

        // Set error message if format is invalid
        errorSetter(prevState => ({ ...prevState, [name]: errorMessage }));
    };

    const formatValue = (value, name) => {
        // Remove any non-digit characters
        let formattedValue = value.replace(/\D/g, '');

        // Apply formatting based on input type
        if (name === 'SSN' || name === 'ITIN') {
            if (formattedValue.length > 9) {
                formattedValue = formattedValue.slice(0, 9);
            }
            if (formattedValue.length <= 3) {
                formattedValue = formattedValue;
            } else if (formattedValue.length <= 5) {
                formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 5)}`;
            } else {
                formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 5)}-${formattedValue.slice(5, 9)}`;
            }
        } else if (name === 'EIN') {
            if (formattedValue.length > 9) {
                formattedValue = formattedValue.slice(0, 9);
            }
            if (formattedValue.length <= 2) {
                formattedValue = formattedValue;
            } else {
                formattedValue = `${formattedValue.slice(0, 2)}-${formattedValue.slice(2, 9)}`;
            }
        }
        return formattedValue;
    };

    const handleSecondInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSecondOwnerFormData({
            ...secondOwnerFormData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    const handleHomeBasedSelect = (value) => {
        setIsHomeBased(value);
        handleNext()
    };
    const handleDateChange = (newValue) => {
        setRegistrationDate(newValue);
    };
    const handleDobDateChange = (newValue) => {
        setDateOfBirth(newValue)
        const now = dayjs();
        const dob = dayjs(newValue);
        const age = now.diff(dob, 'year');

        if (age < 18) {
            setErrorMessage('User must be 18 years or above');
            setIsFormValid(false);
        } else {
            setErrorMessage('');
            setIsFormValid(true);
        }
    };

    const handleLoanPurpose = (purpose) => {
        setLoanPurpose(purpose)
        handleNext()
    }

    const loanPurposes = [
        "Expand Business", "Import Goods", "Promote Business", "Purchase a vehicle", "Improve Cash Flow", "Purchase Equipment", "Pay Taxes", "Remodel Location", "Purchase Property", "Refinance an existing loan", "Purchase Inventory"
    ];
    const isStepValid = (step) => {
        switch (step) {
            case 1:
                return address.city && address.state && address.street && address.unit && address.zip && taxDetails.SSN && !errorMessages.SSN;
            case 4:
                return homeAddress.city && homeAddress.state && homeAddress.street && homeAddress.unit && homeAddress.zip && taxDetails.EIN && !errorMessages.EIN && taxDetails.ITIN && !errorMessages.ITIN;
            case 5:
                return dateOfBirth && !errorMessage;
            // case 6:
            //     return taxDetails.EIN && !errorMessages.EIN && (taxDetails.SSN || taxDetails.ITIN) && !errorMessages.SSN && !errorMessages.ITIN;
            case 11:
                return secondOwnerHomeAddress.city && secondOwnerHomeAddress.state && secondOwnerHomeAddress.street && secondOwnerHomeAddress.unit && secondOwnerHomeAddress.zip;
            case 10:
                return secondOwnerFormData.firstName && secondOwnerFormData.lastName && secondOwnerFormData.email && secondOwnerFormData.contactNumber && secondOwnerFormData.agreement;
            case 12:
                return secondOwnerTaxDetails.EIN && !errorMessages.EIN && (secondOwnerTaxDetails.SSN || secondOwnerTaxDetails.ITIN) && !errorMessages.SSN && !errorMessages.ITIN;

            default:
                return false;
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Start loading

        const formData = {
            owner_one_name: prevFormData.firstName + prevFormData.lastName,
            owner_one_email: prevFormData.email,
            owner_one_contact: prevFormData.contactNumber.toString(),
            owner_one_dob: formatDate(dateOfBirth),
            owner_one_ssn: taxDetails.SSN.toString() || taxDetails.EIN.toString(),
            owner_one_percentage: ownershipPercentage.toString(),
            owner_one_address: homeAddress.unit + homeAddress.street + homeAddress.city + homeAddress.state,
            owner_one_city: homeAddress.city,
            owner_one_state: homeAddress.state,
            owner_one_zip: homeAddress.zip.toString(),
            owner_one_cs: location.state.creditScore.toString(),
            owner_two_name: secondOwnerFormData.firstName + secondOwnerFormData.lastName,
            owner_two_email: secondOwnerFormData.email,
            owner_two_contact: secondOwnerFormData.contactNumber.toString(),
            owner_two_dob: formatDate(secondOwnerDOB),
            owner_two_ssn: secondOwnerTaxDetails.SSN.toString() || secondOwnerTaxDetails.EIN.toString(),
            owner_two_percentage: (100 - ownershipPercentage).toString(),
            owner_two_address: secondOwnerHomeAddress.unit + secondOwnerHomeAddress.street + secondOwnerHomeAddress.city + secondOwnerHomeAddress.state,
            owner_two_city: secondOwnerHomeAddress.city,
            owner_two_state: secondOwnerHomeAddress.state,
            owner_two_zip: secondOwnerHomeAddress.zip.toString(),
            owner_two_cs: location.state.creditScore.toString(),
            business_address: address.unit + address.street + address.city + address.state,
            business_city: address.city,
            business_state: address.state,
            business_zip: address.zip.toString(),
            business_entity: businessEntity,
            business_start_date: formatDate(registrationDate),
            use_of_loan: loanPurpose,
            company_name: prevFormData.businessName,
            loan_amount: location.state.loanAmount.toString()
        };
        e.preventDefault();
        try {
            const response = await axios.post('https://us-central1-ethan-klendify.cloudfunctions.net/api/form', formData, { withCredentials: true });
            window.location.href = response.data.url; // Redirect to the DocuSign signing ceremony
        } catch (error) {
            console.error('Error submitting form', error);
        } finally {
            setIsLoading(false); // End loading whether successful or not
        }
    };

    useEffect(() => {
        setIsFormValid(isStepValid(activeStep));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taxDetails, errorMessages, activeStep, errorMessage]);

    return (
        <div className="form-container">
            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
            </Stepper>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <LinearProgress variant="determinate" value={progress} sx={{ mt: 2, mb: 2, flex: 1, marginRight: '10px', height: '10px', borderRadius: "20px" }} />
                <span>{`${Math.round(progress)}%`}</span>
            </div>
            {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                    <LottieAnimation />
                </div>
        ) : (
            <>
                {activeStep === 0 && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom className="step-title">
                            Business Entity
                        </Typography>
                        <Grid container spacing={2}>
                            {["LLC", "Sole Proprietorship", "Partnership", "Non-Profit", "C Corporation", "S Corporation", "Professional Corporation", "I haven't registered it yet", "I am not sure",].map((entity) => (
                                <Grid item xs={6} key={entity}>
                                    <Button variant="outlined" fullWidth className={`business-entity-button ${businessEntity === entity ? 'selected' : ''}`} onClick={() => handleBusinessEntitySelect(entity)} >
                                        {entity}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        {/* <div className="step-navigation">
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!businessEntity}>
                            Next
                        </Button>
                    </div> */}
                    </div>
                )}
                {activeStep === 1 && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom className="step-title">
                            Please enter your business address
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.keys(address).map((key) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <TextField label={key.charAt(0).toUpperCase() + key.slice(1)} name={key} value={address[key]} onChange={handleAddressChange} fullWidth margin="normal" required />

                                </Grid>
                            ))}
                        </Grid>
                        <TextField
                            error={!!errorMessages.SSN}
                            label="SSN"
                            variant="outlined"
                            name="SSN"
                            value={taxDetails.SSN}
                            onChange={handleInputChange(setTaxDetails, setErrorMessages)}
                            fullWidth
                            required
                        />
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(1)}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 2 && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom className="step-title">
                            Is this home-based business?
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Button variant="outlined" fullWidth className={`home-based-button ${isHomeBased === true ? 'selected' : ''}`} onClick={() => handleHomeBasedSelect(true)}  >
                                    Yes
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="outlined" fullWidth className={`home-based-button ${isHomeBased === false ? 'selected' : ''}`} onClick={() => handleHomeBasedSelect(false)} >
                                    No
                                </Button>
                            </Grid>
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            {/* <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={isHomeBased === null}>
                            Next
                        </Button> */}
                        </div>
                    </div>
                )}
                {activeStep === 3 && (
                    <div className="step-content-button">
                        <Typography variant="h5" align="center" gutterBottom className="step-title">
                            Business Registration Date
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DesktopDatePicker
                                label="Date"
                                value={registrationDate}
                                onChange={handleDateChange}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!registrationDate}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {/* {activeStep === 4 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Your Home Address
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(homeAddress).map(([key, value]) => (
                            <Grid item xs={12} sm={6} key={key}>
                                <TextField label={key.charAt(0).toUpperCase() + key.slice(1)} name={key} value={value} onChange={handleInputChange(setHomeAddress, setErrorMessages)} fullWidth margin="normal" required />
                            </Grid>
                        ))}
                    </Grid>
                    <div className="step-navigation">
                        <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                            Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(4)}>
                            Next
                        </Button>
                    </div>
                </div>
            )} */}
                {activeStep === 4 && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            Your Home Address
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(homeAddress).map(([key, value]) => (
                                <Grid item xs={12} sm={6} key={key}>
                                    <TextField label={key.charAt(0).toUpperCase() + key.slice(1)} name={key} value={value} onChange={handleInputChange(setHomeAddress, setErrorMessages)} fullWidth margin="normal" required />
                                </Grid>
                            ))}
                            <TextField
                                error={!!errorMessages.EIN}
                                label="EIN"
                                variant="outlined"
                                name="EIN"
                                value={taxDetails.EIN}
                                onChange={handleInputChange(setTaxDetails, setErrorMessages)}
                                fullWidth
                                required
                            />
                            <TextField
                                error={!!errorMessages.ITIN}
                                label="ITIN"
                                variant="outlined"
                                name="ITIN"
                                value={taxDetails.ITIN}
                                onChange={handleInputChange(setTaxDetails, setErrorMessages)}
                                fullWidth
                                required
                            />
                        </Grid>

                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(4)}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 5 && (
                    <div className="step-content-date">
                        <Typography variant="h5" align="center" gutterBottom>
                            Your Date of Birth
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DesktopDatePicker label="Date" name='dateOfBirth' value={dateOfBirth} onChange={handleDobDateChange} renderInput={(params) => <TextField {...params} fullWidth />} />
                        </LocalizationProvider>
                        {errorMessage && (
                            <Typography variant="body2" color="error" align="center">
                                {errorMessage}
                            </Typography>
                        )}
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(5)}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {/* {activeStep === 6 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Your Tax Details
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(taxDetails).map(([key, value]) => (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    error={!!errorMessages[key]}
                                    label={key}
                                    variant="outlined"
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange(setTaxDetails, setErrorMessages)}
                                    fullWidth
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <div className="step-navigation">
                        <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                            Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isFormValid}>
                            Next
                        </Button>
                    </div>
                    <div className="image-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <img src={secureImage} alt="Image 1" style={{ width: '20%' }} />
                        <img src={trustedImage} alt="Image 2" style={{ width: '20%' }} />
                    </div>
                </div>
            )} */}



                {activeStep === 7 && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            Are you the sole owner?
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button variant={isSoleOwner ? "contained" : "outlined"} onClick={() => setIsSoleOwner(true)} >
                                    Yes
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant={!isSoleOwner ? "contained" : "outlined"} onClick={() => setIsSoleOwner(false)}>
                                    No
                                </Button>
                            </Grid>
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={isSoleOwner === null}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 8 && !isSoleOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            What percentage of ownership do you have?
                        </Typography>
                        <Typography gutterBottom>
                            Enter Ownership Percentage (0-100%)
                        </Typography>
                        <TextField
                            type="number"
                            value={ownershipPercentage}
                            onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value) && value >= 0 && value <= 100) {
                                    setOwnershipPercentage(value);
                                }
                            }}
                            label="Ownership Percentage"
                            variant="outlined"
                            fullWidth
                            inputProps={{ min: '', max: 100 }}
                        />
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button">
                                Next
                            </Button>
                        </div>
                    </div>
                )}


                {activeStep === 8 && isSoleOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            What do you need the money for?
                        </Typography>
                        <Grid container spacing={2}>
                            {loanPurposes.map(purpose => (
                                <Grid item xs={12} sm={6} key={purpose}>
                                    <Button variant={loanPurpose === purpose ? "contained" : "outlined"} onClick={() => handleLoanPurpose(purpose)} fullWidth >
                                        {purpose}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            {/* <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!loanPurpose}>
                            Next
                        </Button> */}
                        </div>
                    </div>
                )}
                {activeStep === 9 && !isSoleOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            Do you want to add a second owner?
                        </Typography>
                        <Typography>
                            Add second owner if ownership is more than 49%
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button variant={addSecondOwner ? "contained" : "outlined"} onClick={() => setAddSecondOwner(true)} >
                                    Yes
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant={!addSecondOwner ? "contained" : "outlined"} onClick={() => setAddSecondOwner(false)}   >
                                    No
                                </Button>
                            </Grid>
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button">
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 10 && !isSoleOwner && !addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            What do you need the money for?
                        </Typography>
                        <Grid container spacing={2}>
                            {loanPurposes.map(purpose => (
                                <Grid item xs={12} sm={6} key={purpose}>
                                    <Button variant={loanPurpose === purpose ? "contained" : "outlined"} onClick={() => handleLoanPurpose(purpose)} fullWidth >
                                        {purpose}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!loanPurpose}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 9 && isSoleOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            When do you need the money?
                        </Typography>
                        <Grid container spacing={2}>
                            {fundingOptions.map(option => (
                                <Grid item xs={12} sm={6} key={option}>
                                    <Button variant={fundingTime === option ? "contained" : "outlined"} onClick={() => setFundingTime(option)} fullWidth >
                                        {option}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit} className="next-button">
                                Submit
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 11 && !isSoleOwner && !addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            When do you need the money?
                        </Typography>
                        <Grid container spacing={2}>
                            {fundingOptions.map(option => (
                                <Grid item xs={12} sm={6} key={option}>
                                    <Button
                                        variant={fundingTime === option ? "contained" : "outlined"}
                                        onClick={() => setFundingTime(option)}
                                        fullWidth
                                    >
                                        {option}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit} className="next-button">
                                Submit
                            </Button>
                        </div>
                    </div>
                )}

                {activeStep === 10 && !isSoleOwner && addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom className="step-title">
                            Input Second Owner information
                        </Typography>
                        <Typography variant="body1" align="center" gutterBottom className="sub-text">
                            And get your loan offer now!
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="First Name"
                                    name="firstName"
                                    value={secondOwnerFormData.firstName}
                                    onChange={handleSecondInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
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
                                <PhoneInput
                                    country={'us'}
                                    value={secondOwnerFormData.contactNumber}
                                    onChange={handlePhoneChange}
                                    inputStyle={{ width: '100%' }}
                                />
                            </Grid>
                        </Grid>
                        <FormControlLabel
                            control={<Checkbox name="agreement" checked={secondOwnerFormData.agreement} onChange={handleSecondInputChange} />}
                            // eslint-disable-next-line react/no-unescaped-entities
                            label={<Typography variant="body2">By selecting "Get Loan Offers" you agree to our <a href="#privacy-policy">Privacy Policy</a>.</Typography>}
                            className="agreement-checkbox"
                        />
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(10)}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 11 && !isSoleOwner && addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            Second Owner Home Address
                        </Typography>
                        <Grid container spacing={2}>
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
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(11)}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 12 && !isSoleOwner && addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            Second Owner Tax Details
                        </Typography>
                        <Grid container spacing={2}>
                            {Object.entries(secondOwnerTaxDetails).map(([key, value]) => (
                                <Grid item xs={12} key={key}>
                                    <TextField
                                        error={!!errorMessages[key]}
                                        label={key}
                                        variant="outlined"
                                        name={key}
                                        value={value}
                                        onChange={handleInputChange(setSecondOwnerTaxDetails, setErrorMessages)}
                                        inputProps={{ maxLength: key === 'SSN' || key === 'ITIN' || key === 'EIN' ? 9 : undefined }}
                                        fullWidth
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!isStepValid(12)}>
                                Next
                            </Button>
                        </div>
                        <div className="image-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                            <img src={secureImage} alt="Image 1" style={{ width: '20%' }} />
                            <img src={trustedImage} alt="Image 2" style={{ width: '20%' }} />
                        </div>
                    </div>
                )}
                {activeStep === 13 && !isSoleOwner && addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            Second Owner Date of Birth
                        </Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>

                            <DesktopDatePicker
                                label="Date"
                                name='secondOwnerDOB'
                                value={secondOwnerDOB}
                                onChange={(newValue) => handleDateChange(setSecondOwnerDOB, newValue)}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </LocalizationProvider>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!dateOfBirth}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 14 && !isSoleOwner && addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            What do you need the money for?
                        </Typography>
                        <Grid container spacing={2}>
                            {loanPurposes.map(purpose => (
                                <Grid item xs={12} sm={6} key={purpose}>
                                    <Button
                                        variant={loanPurpose === purpose ? "contained" : "outlined"}
                                        onClick={() => handleLoanPurpose(purpose)}
                                        fullWidth
                                    >
                                        {purpose}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!loanPurpose}>
                                NEXT
                            </Button>
                        </div>
                    </div>
                )}
                {activeStep === 15 && !isSoleOwner && addSecondOwner && (
                    <div className="step-content">
                        <Typography variant="h5" align="center" gutterBottom>
                            When do you need the money?
                        </Typography>
                        <Grid container spacing={2}>
                            {fundingOptions.map(option => (
                                <Grid item xs={12} sm={6} key={option}>
                                    <Button
                                        variant={fundingTime === option ? "contained" : "outlined"}
                                        onClick={() => setFundingTime(option)}
                                        fullWidth
                                    >
                                        {option}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                        <div className="step-navigation">
                            <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                Back
                            </Button>
                            <Button variant="contained" color="primary" onClick={handleSubmit} className="next-button">
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
