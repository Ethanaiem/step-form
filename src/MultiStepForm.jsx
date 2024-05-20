// MultiStepForm.jsx
import { useState } from 'react';
import { TextField, Button, Stepper, Step, StepLabel, Typography, Grid, Checkbox, FormControlLabel } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase.config';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'; 
import './MultiStepForm.css';

const MultiStepForm = () => {
    const [activeStep, setActiveStep] = useState(0);
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
    // eslint-disable-next-line no-unused-vars
    const [preApproved, setPreApproved] = useState(false);

    const navigate = useNavigate();

    const steps = ['1', '2', '3', '4', '5'];

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleLoanAmountChange = (event) => {
        setLoanAmount(event.target.value);
    };

    const handleTimePeriodSelect = (period) => {
        setTimePeriod(period);
    };

    const handleMonthlyRevenueSelect = (revenue) => {
        setMonthlyRevenue(revenue);
    };

    const handleCreditScoreSelect = (score) => {
        setCreditScore(score);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handlePhoneChange = (value) => {
        setFormData({
            ...formData,
            contactNumber: value,
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'loanApplications'), where('email', '==', formData.email));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                await addDoc(collection(db, 'loanApplications'), {
                    loanAmount,
                    timePeriod,
                    monthlyRevenue,
                    creditScore,
                    ...formData
                });
                setMessage('You have been pre-approved successfully!');
            } else {
                setMessage('You have been pre-approved successfully!');
                setPreApproved(true); // Set pre-approved state
            }

            setLoading(false);
            setActiveStep(steps.length);
        } catch (error) {
            console.error("Error adding document: ", error);
            setLoading(false);
        }
    };

    const isStep4Valid = () => {
        return formData.firstName && formData.lastName && formData.email && formData.contactNumber && formData.businessName && formData.agreement;
    };

    const changeForm = () => {
        navigate('/extended-form', {state: {
            formData: formData,
            loanAmount: loanAmount,
            creditScore: creditScore,
            monthlyRevenue: monthlyRevenue

        }})
    }

    return (
        <div className="form-container">
            <Typography variant="h6" align="center" gutterBottom className="title">
                QUICK & FLEXIBLE BUSINESS LOANS
            </Typography>
            <Typography variant="h5" align="center" gutterBottom className="subtitle">
                Get Pre-Qualified for Financing
            </Typography>
            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {loading ? (
                <div className="loading-container">
                    <CircularProgress />
                    <Typography variant="h6" align="center" gutterBottom>
                        Saving your data...
                    </Typography>
                </div>
            ) : (
                <>
                    {activeStep === 0 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Enter your desired loan amount.
                            </Typography>
                            <TextField
                                type="number"
                                label="Loan Amount"
                                value={loanAmount}
                                onChange={handleLoanAmountChange}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    startAdornment: <span className="dollar-sign">$</span>,
                                }}
                                className="loan-amount-input"
                            />
                            <div className="step-navigation">
                                <Button variant="contained" onClick={handleNext} className="next-button">
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                    {activeStep === 1 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Business Operating Time
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    "Less than 3 months",
                                    "3 - 5 months",
                                    "6 - 12 months",
                                    "1 - 2 years",
                                    "2 - 5 years",
                                    "More than 5 years",
                                    "I currently don't own a business",
                                ].map((period) => (
                                    <Grid item xs={6} key={period}>
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
                                <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className="next-button"
                                    disabled={!timePeriod}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                    {activeStep === 2 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Gross Monthly Revenue
                            </Typography>
                            <Grid container spacing={2}>
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
                                    <Grid item xs={6} key={revenue}>
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
                                <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className="next-button"
                                    disabled={!monthlyRevenue}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                    {activeStep === 3 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Personal Credit Score
                            </Typography>
                            <Grid container spacing={2}>
                                {[
                                    "500 and Below",
                                    "500 - 549",
                                    "550 - 599",
                                    "600 - 649",
                                    "650 - 719",
                                    "720 or Above",
                                    "Not Sure",
                                ].map((score) => (
                                    <Grid item xs={6} key={score}>
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
                                <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    className="next-button"
                                    disabled={!creditScore}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                    {activeStep === 4 && (
                        <div className="step-content">
                            <Typography variant="h5" align="center" gutterBottom className="step-title">
                                Input your basic business information
                            </Typography>
                            <Typography variant="body1" align="center" gutterBottom className="sub-text">
                                And get your loan offer now!
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        fullWidth
                                        margin="normal"
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
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <PhoneInput
                                        country={'us'}
                                        value={formData.contactNumber}
                                        onChange={handlePhoneChange}
                                        inputStyle={{ width: '100%' }}
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
                                    />
                                </Grid>
                            </Grid>
                            <FormControlLabel
                                control={<Checkbox name="agreement" checked={formData.agreement} onChange={handleInputChange} />}
                                // eslint-disable-next-line react/no-unescaped-entities
                                label={<Typography variant="body2">By selecting "Get Loan Offers" you agree to our <a href="https://www.klendify.com/privacy-policy" target="_blank">Privacy Policy</a>.</Typography>}
                                className="agreement-checkbox"
                            />
                            <div className="step-navigation">
                                <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                                    Back
                                </Button>
                                <Button variant="contained" color="primary" onClick={handleSubmit} className="next-button" disabled={!isStep4Valid()}>
                                    Get Loan Offers
                                </Button>
                            </div>
                        </div>
                    )}
                    {activeStep === steps.length && (
                        <div className="completion-message">
                            <div className="completion-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24"><path fill="#1e2a78" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.706 18.207l-4.793-4.793 1.414-1.414 3.379 3.379 7.379-7.379 1.414 1.414-8.793 8.793z"/></svg>
                            </div>
                            <Typography variant="h5" align="center" gutterBottom>
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
