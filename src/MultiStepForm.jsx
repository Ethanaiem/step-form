// MultiStepForm.jsx
import { useState, useEffect} from 'react';
import { TextField, Button, Stepper, Step, StepLabel, Typography, Grid, FormControlLabel, Checkbox, Box, Modal } from '@mui/material';
import 'react-phone-input-2/lib/style.css';

import { useNavigate } from 'react-router-dom';
import { db } from './firebase.config';
import { collection, addDoc, getDocs, query, where, setDoc } from 'firebase/firestore';
import './MultiStepForm.css';
import LottieAnimation from './LottieAnimation';
import FinishingAnimation from './FinishingAnimation';

import img1 from './assets/66398c2d1946fd86bce731bd_3.png'
import img2 from './assets/66398c2d8e95b96249977819_1.png'
import img3 from './assets/66398c2d8e95b9624997780c_2.png'

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resumeEmail, setResumeEmail] = useState('');
    const [loanAmount, setLoanAmount] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [monthlyRevenue, setMonthlyRevenue] = useState('');
    const [creditScore, setCreditScore] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        businessName: '',
        agreement: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        businessName: '',
        // agreement: ''
    });
    const [taxDetails, setTaxDetails] = useState({ SSN: '', });
    const [errorMessages, setErrorMessages] = useState({ SSN: '', });
    const [extentedFormFields, setExtendedFormFields] = useState([])
    // eslint-disable-next-line no-unused-vars
    const [preApproved, setPreApproved] = useState(false);

    const navigate = useNavigate();

    const steps = ['1', '2', '3', '4', '5'];

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleEmailChange = (event) => {
        setResumeEmail(event.target.value);
    };
    const handleResumeForm = async () => {
        const q = query(collection(db, 'loanApplications'), where('email', '==', resumeEmail));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            alert("No records found for this email.");
            return;
        }
    
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const formDataKeys = ['firstName', 'lastName', 'email', 'contactNumber', 'businessName', 'agreement'];
            const otherKnownKeys = ['SSN', 'loanAmount', 'timePeriod', 'monthlyRevenue', 'creditScore'];
            const filteredData = {};
            const extendedFormFields = {};
    
            Object.keys(data).forEach(key => {
                if (formDataKeys.includes(key)) {
                    filteredData[key] = data[key];
                } else if (otherKnownKeys.includes(key)) {
                    switch (key) {
                        case 'SSN':
                            setTaxDetails(prev => ({ ...prev, SSN: data[key] }));
                            break;
                        case 'loanAmount':
                            setLoanAmount(data[key]);
                            break;
                        case 'timePeriod':
                            setTimePeriod(data[key]);
                            break;
                        case 'monthlyRevenue':
                            setMonthlyRevenue(data[key]);
                            break;
                        case 'creditScore':
                            setCreditScore(data[key]);
                            break;
                        default:
                            break;
                    }
                } else {
                    extendedFormFields[key] = data[key];
                }
            });
    
            // Update formData state
            setFormData(prev => ({ ...prev, ...filteredData }));
            console.log(filteredData, 'filteredData')
            // Update a new state for handling additional, unexpected data
            setExtendedFormFields(extendedFormFields);
    
            // Check if `businessEntity` is not empty and act accordingly
            if (extendedFormFields['businessEntity'] && extendedFormFields['businessEntity'].trim() !== "") {
                // Call changeForm or similar function to change the form or navigate away
                localStorage.setItem('email', formData.email)
                navigate('/extended-form', {
                    state: {
                        formData: filteredData,
                        loanAmount: loanAmount,
                        creditScore: creditScore,
                        monthlyRevenue: monthlyRevenue,
                        // ssn: taxDetails.SSN,
                        extentedFormFields: extentedFormFields
                    }
                })
            } else {
                // Otherwise, resume at the designated step
                setActiveStep(4);
            }
        });
    };
    

    const handleNext = async () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleLoanAmountChange = (event) => {
        // Remove all non-digits and then format
        const amount = event.target.value.replace(/\D/g, ''); // Remove non-digits
        const formattedAmount = amount.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Insert commas
        setLoanAmount(formattedAmount);
    };


    const handleTimePeriodSelect = (period) => {
        setTimePeriod(period);
        handleNext()
    };

    const handleMonthlyRevenueSelect = (revenue) => {
        setMonthlyRevenue(revenue);
        handleNext()
    };

    const handleCreditScoreSelect = (score) => {
        setCreditScore(score);
        handleNext()
    };

    const handlePhoneInputChange = (event) => {
        const input = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
        let formattedInput = '';
        let errorMessage = '';

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
            errorMessage = 'Complete phone number required';
        }

        // Update state
        setFormData({
            ...formData,
            contactNumber: formattedInput
        });

        // Set or clear error message
        setErrors({
            ...errors,
            contactNumber: errorMessage
        });
    };

    const validatePhoneInputOnBlur = () => {
        const errorMessage = formData.contactNumber.length < 14 ? 'Complete phone number required' : '';
        setErrors({
            ...errors,
            contactNumber: errorMessage
        });
    };

    const validateField = (name, value) => {
        switch (name) {
            case 'firstName':
            case 'lastName':
            case 'businessName':
                if (!value.trim()) {
                    return 'This field cannot be empty';
                }
                break;
            case 'email':
                if (!/\S+@\S+\.\S+/.test(value)) {
                    return 'Please enter a valid email address';
                }
                break;
            case 'contactNumber':
                if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(value)) {
                    return 'Please enter a valid phone number (e.g., (123) 456-7890)';
                }
                break;
            // case 'SSN':
            //     if (!/^\d{3}-\d{2}-\d{4}$/.test(value)) {
            //         return 'Please enter a valid SSN (e.g., 123-45-6789)';
            //     }
            //     break;
            default:
                return '';
        }
        return '';
    };



    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Set the form data
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Validate the field and update the error state
        const error = validateField(name, value);
        setErrors({
            ...errors,
            [name]: error
        });
    };

    // const handleInputChangeSSN = (setter, errorSetter) => (event) => {
    //     const { name, value } = event.target;
    //     const formattedValue = formatValue(value, name); // Format the input value
    //     setter(prevState => ({ ...prevState, [name]: formattedValue }));

    //     // Validate SSN field
    //     const error = validateField(name, formattedValue);
    //     errorSetter(prevState => ({ ...prevState, [name]: error }));
    // };


    // const formatValue = (value, name) => {
    //     // Remove any non-digit characters
    //     let formattedValue = value.replace(/\D/g, '');

    //     // Apply formatting based on input type
    //     if (name === 'SSN') {
    //         if (formattedValue.length > 9) {
    //             formattedValue = formattedValue.slice(0, 9);
    //         }
    //         if (formattedValue.length <= 3) {
    //             formattedValue = formattedValue;
    //         } else if (formattedValue.length <= 5) {
    //             formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 5)}`;
    //         } else {
    //             formattedValue = `${formattedValue.slice(0, 3)}-${formattedValue.slice(3, 5)}-${formattedValue.slice(5, 9)}`;
    //         }
    //     }
    //     return formattedValue;
    // };
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'loanApplications'), where('email', '==', formData.email));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                // If no existing application with the email, add a new document
                await addDoc(collection(db, 'loanApplications'), {
                    loanAmount,
                    timePeriod,
                    monthlyRevenue,
                    creditScore,
                    // SSN: taxDetails.SSN,
                    ...formData
                });
                setMessage('You have been pre-approved successfully!');
                setPreApproved(true); // Assuming you want to set this only when new doc is added
            } else {
                // If application with the email already exists, replace it with specific fields only
                querySnapshot.forEach(async (doc) => {
                    await setDoc(doc.ref, {
                        loanAmount,
                        timePeriod,
                        monthlyRevenue,
                        creditScore,
                        // SSN: taxDetails.SSN,
                        ...formData
                    });
                });
                setMessage('Application data updated with new details!');
                setPreApproved(true); // Set pre-approved state if updated
            }
    
            setLoading(false);
            setActiveStep(steps.length);
        } catch (error) {
            console.error("Error handling the application: ", error);
            setLoading(false);
        }
    };
    
    const isStep4Valid = () => {
        const allFieldsFilled = Object.values(formData).every(value => value);
        const noErrors = Object.values(errors).every(error => !error);
        // const hasSSN = !!taxDetails.SSN;
    
        return allFieldsFilled && noErrors ;
    };

    const changeForm = () => {
        localStorage.setItem('email', formData.email)
        navigate('/extended-form', {
            state: {
                formData: formData,
                loanAmount: loanAmount,
                creditScore: creditScore,
                monthlyRevenue: monthlyRevenue,
                // ssn: taxDetails.SSN,
                extentedFormFields: extentedFormFields
            }
        })
    }

    return (
        <div className="form-container">


            {/* <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper> */}
            {loading ? (
                <div className="loading-container">
                    <LottieAnimation />
                </div>
            ) : (
                <>
                    {activeStep === 0 && (
                        <>
                            <Typography align="center" gutterBottom className="title">
                                QUICK & FLEXIBLE BUSINESS LOANS
                            </Typography>
                            <div style={{ display: "flex", justifyContent: "center", }} >
                                <img src={img1} alt="" className='image-setter' />
                                <img src={img2} alt="" style={{margin: "0 20px" }} className='image-setter' />
                                <img src={img3} alt="" className='image-setter' />
                            </div>
                            <div className="step-content">

                                <Typography variant="h5" align="center" gutterBottom className="step-title-mini">
                                    Enter your desired loan amount.
                                </Typography>
                                <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                                    {steps.map((label, index) => (
                                        <Step key={index}>
                                            <StepLabel>{label}</StepLabel>
                                        </Step>
                                    ))}
                                </Stepper>
                                <TextField
                                    type="text"
                                    label="Loan Amount"
                                    value={loanAmount}
                                    onChange={handleLoanAmountChange}
                                    fullWidth
                                    placeholder='25,000'
                                    margin="normal"
                                    InputProps={{
                                        startAdornment: <span className="dollar-sign">$</span>,
                                        classes: {
                                            input: 'loan-amount-input' // Add this line
                                        }
                                    }}
                                    className="loan-amount-input"
                                />

                                <Box display={'flex'} flexDirection={'column'} className="step-navigation">
                                    <Button variant="contained" onClick={handleNext} className="loan-next-button" disabled={!loanAmount}>
                                        GET LOANS OFFERS
                                    </Button>
                                    {/* <Button variant="contained" color="secondary" className="loan-next-button" onClick={handleOpenModal}>
                                        Resume Form
                                    </Button> */}
                                    <p style={{color:"#154192",fontSize:"18px",fontWeight:"700",cursor:"pointer"}} onClick={handleOpenModal}>Resume Form</p>
                                </Box>
                                <Modal
                                    open={isModalOpen}
                                    onClose={handleCloseModal}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Enter your email to resume the form
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            variant="outlined"
                                            value={resumeEmail}
                                            onChange={handleEmailChange}
                                            margin="normal"
                                        />
                                        <Button onClick={handleResumeForm} variant="contained" color="primary" fullWidth>
                                            Resume
                                        </Button>
                                    </Box>
                                </Modal>
                                <p style={{ fontSize: "14px" }}>It’s FREE and won’t affect your credit score.</p>
                            </div>
                        </>
                    )}
                    {activeStep === 1 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Business Operating Time
                            </Typography>

                            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Grid container spacing={3}>
                                {[
                                    "Less than 3 months",
                                    "3 - 5 months",
                                    "6 - 12 months",
                                    "1 - 2 years",
                                    "2 - 5 years",
                                    "More than 5 years",
                                    "I currently don't own a business",
                                ].map((period) => (
                                    <Grid item xs={12} sm={6} key={period}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            className={`time-period-button ${timePeriod === period ? 'selected' : ''}`}
                                            onClick={() => handleTimePeriodSelect(period)}
                                        >
                                            {period}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                            <div className="step-navigation">
                                <Button variant="contained" color="secondary" onClick={handleBack} className="loan-next-button">
                                    Back
                                </Button>

                                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className="next-button"
                                    disabled={!timePeriod}
                                >
                                    Next
                                </Button> */}
                            </div>
                        </div>
                    )}
                    {activeStep === 2 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Gross Monthly Revenue
                            </Typography>
                            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Grid container spacing={3}>
                                {[
                                    "Less than $1,000",
                                    "$1,000 - $5,000",
                                    "$5,000 - $15,000",
                                    "$15,000 - $20,000",
                                    "$20,000 - $30,000",
                                    "$30,000 - $50,000",
                                    "$50,000 - $100,000",
                                    "$100,000 - $200,000",
                                    "$200,000+",
                                ].map((revenue) => (
                                    <Grid item xs={12} sm={6} key={revenue}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            className={`time-period-button ${monthlyRevenue === revenue ? 'selected' : ''}`}
                                            onClick={() => handleMonthlyRevenueSelect(revenue)}
                                        >
                                            {revenue}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                            <div className="step-navigation">
                                <Button variant="contained" color="secondary" onClick={handleBack} className="loan-next-button">
                                    Back
                                </Button>
                                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className="next-button"
                                    disabled={!monthlyRevenue}
                                >
                                    Next
                                </Button> */}
                            </div>
                        </div>
                    )}
                    {activeStep === 3 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Personal Credit Score
                            </Typography>
                            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Grid container spacing={3}>
                                {[
                                    "500 and Below",
                                    "500 - 549",
                                    "550 - 599",
                                    "600 - 649",
                                    "650 - 719",
                                    "720 or Above",
                                    "Not Sure",
                                ].map((score) => (
                                    <Grid item xs={12} sm={6} key={score}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            className={`time-period-button ${creditScore === score ? 'selected' : ''}`}
                                            onClick={() => handleCreditScoreSelect(score)}
                                        >
                                            {score}
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                            <div className="step-navigation">
                                <Button variant="contained" color="secondary" onClick={handleBack} className="loan-next-button">
                                    Back
                                </Button>
                                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className="next-button"
                                    disabled={!creditScore}
                                >
                                    Next
                                </Button> */}
                            </div>
                        </div>
                    )}
                    {activeStep === 4 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Input your basic business information
                            </Typography>
                            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                                {steps.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                            <Typography variant="body1" align="center" gutterBottom className="sub-text">
                                And get your loan offer now!
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item  xs={12} sm={6} >
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        onBlur={handleInputChange} // Validate on blur
                                        error={!!errors.firstName}
                                        helperText={errors.firstName && 'This field cannot be empty'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} >
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        onBlur={handleInputChange} // Validate on blur
                                        error={!!errors.lastName}
                                        helperText={errors.lastName && 'This field cannot be empty'}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Email Address"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        onBlur={handleInputChange} // Validate on blur
                                        error={!!errors.email}
                                        helperText={errors.email && 'This field cannot be empty'}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Contact Number"
                                        name="contactNumber"
                                        value={formData.contactNumber}
                                        onChange={handlePhoneInputChange}
                                        fullWidth
                                        margin="normal"
                                        onBlur={validatePhoneInputOnBlur} // Validate on blur
                                        error={!!errors.contactNumber}
                                        helperText={errors.contactNumber}
                                        inputProps={{
                                            maxLength: 14 // Limit input length to fit formatted number
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Business Legal Name"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                        onBlur={handleInputChange} // Validate on blur
                                        error={!!errors.businessName}
                                        helperText={errors.businessName && 'This field cannot be empty'}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} style={{ marginTop: "15px" }}>
                                    <TextField
                                        error={!!errorMessages.SSN}
                                        label="SSN"
                                        variant="outlined"
                                        name="SSN"
                                        value={taxDetails.SSN}
                                        onChange={handleInputChangeSSN(setTaxDetails, setErrorMessages)}
                                        fullWidth
                                        required
                                    />
                                    {errorMessages.SSN && <Typography variant="caption" color="error">{errorMessages.SSN}</Typography>}
                                </Grid> */}
                            </Grid>
                            <FormControlLabel
                                control={<Checkbox name="agreement" checked={formData.agreement} onChange={handleInputChange} />}
                                // eslint-disable-next-line react/no-unescaped-entities
                                label={<Typography variant="body2">By selecting "Get Loan Offers" you agree to our <a href="https://www.klendify.com/privacy-policy" target="_blank">Privacy Policy</a>.</Typography>}
                                className="agreement-checkbox"
                            />
                            <div className="step-navigation">
                                {/* <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                    Back
                                </Button> */}
                                <Button variant="contained" color="primary" onClick={handleSubmit} className="loan-next-button" disabled={!isStep4Valid()}>
                                    Get Loan Offers
                                </Button>
                            </div>
                        </div>
                    )}
                    {activeStep === steps.length && (
                        <div className="completion-message">
                            {/* <div className="completion-icon">

                                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24"><path fill="#1e2a78" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.706 18.207l-4.793-4.793 1.414-1.414 3.379 3.379 7.379-7.379 1.414 1.414-8.793 8.793z" /></svg>
                            </div> */}
                            <FinishingAnimation />
                            <Typography variant="h5" align="center" gutterBottom style={{marginBottom:"20px"}}>
                                {message}
                            </Typography>
                            <Button variant="contained" color="primary" className="next-button" onClick={changeForm}>
                                Continue
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MultiStepForm;
