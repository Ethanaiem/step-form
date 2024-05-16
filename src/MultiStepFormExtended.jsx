import { useState } from 'react';
import { TextField, Button, Stepper, Step, StepLabel, Typography, Grid, Slider, Checkbox, FormControlLabel } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import './MultiStepFormExtended.css';

const MultiStepFormExtended = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [businessEntity, setBusinessEntity] = useState('');
    const [isSoleOwner, setIsSoleOwner] = useState(null);
    const [loanPurpose, setLoanPurpose] = useState('');
    const [ownershipPercentage, setOwnershipPercentage] = useState(50); // Default to 50% for demo
    const [addSecondOwner, setAddSecondOwner] = useState(false);
    const [secondOwnerFormData, setSecondOwnerFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        agreement: false,
    });
    const [address, setAddress] = useState({
        unit: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    });
    const [homeAddress, setHomeAddress] = useState({
        unit: '',
        street: '',
        city: '',
        state: '',
        zip: ''
    });
    const [fundingTime, setFundingTime] = useState('');
    const [isHomeBased, setIsHomeBased] = useState(null);
    const [registrationDate, setRegistrationDate] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState(null);
    const [secondOwnerDOB, setSecondOwnerDOB] = useState(null)
    const [taxDetails, setTaxDetails] = useState({ SSN: '', ITIN: '', EIN: '' });
    const [secondOwnerTaxDetails, setSecondOwnerTaxDetails] = useState({ SSN: '', ITIN: '', EIN: '' });
    const steps = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];
    const fundingOptions = ["Immediately", "1 - 2 Weeks", "30 Days", "More than 30 Days"];


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
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
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress({
            ...address,
            [name]: value,
        });
    };
    const handleInputChange = (setter) => (event) => {
        const { name, value } = event.target;
        setter(prevState => ({
            ...prevState,
            [name]: value
        }));
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
    };

    const handleDateChange = (newValue) => {
        setRegistrationDate(newValue);
    };

    const handleSliderChange = (event, newValue) => {
        setOwnershipPercentage(newValue);
    };

    const loanPurposes = [
        "Expand Business", "Import Goods", "Promote Business", "Purchase a vehicle",
        "Improve Cash Flow", "Purchase Equipment", "Pay Taxes", "Remodel Location",
        "Purchase Property", "Refinance an existing loan", "Purchase Inventory"
    ];

    const isSecondOwnerValid = () => {
        return secondOwnerFormData.firstName && secondOwnerFormData.lastName && secondOwnerFormData.email && secondOwnerFormData.contactNumber && secondOwnerFormData.agreement;
    };

    const handleSubmit = () => {
        console.log("Submitted")
    }

    return (
        <div className="form-container">
            <Stepper activeStep={activeStep} alternativeLabel className="stepper">
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom className="step-title">
                        Business Entity
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            "LLC",
                            "Sole Proprietorship",
                            "Partnership",
                            "Non-Profit",
                            "C Corporation",
                            "S Corporation",
                            "Professional Corporation",
                            "I haven't registered it yet",
                            "I am not sure",
                        ].map((entity) => (
                            <Grid item xs={6} key={entity}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    className={`business-entity-button ${businessEntity === entity ? 'selected' : ''}`}
                                    onClick={() => handleBusinessEntitySelect(entity)}
                                >
                                    {entity}
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                    <div className="step-navigation">
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={!businessEntity}>
                            Next
                        </Button>
                    </div>
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
                                <TextField
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    name={key}
                                    value={address[key]}
                                    onChange={handleAddressChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                        ))}
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
            {activeStep === 2 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom className="step-title">
                        Is this home-based business?
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                fullWidth
                                className={`home-based-button ${isHomeBased === true ? 'selected' : ''}`}
                                onClick={() => handleHomeBasedSelect(true)}
                            >
                                Yes
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                fullWidth
                                className={`home-based-button ${isHomeBased === false ? 'selected' : ''}`}
                                onClick={() => handleHomeBasedSelect(false)}
                            >
                                No
                            </Button>
                        </Grid>
                    </Grid>
                    <div className="step-navigation">
                        <Button variant="contained" color="secondary" onClick={handleBack} className="back-button">
                            Back
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disabled={isHomeBased === null}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
            {activeStep === 3 && (
                <div className="step-content">
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
            {activeStep === 4 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Your Home Address
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(homeAddress).map(([key, value]) => (
                            <Grid item xs={12} sm={6} key={key}>
                                <TextField
                                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange(setHomeAddress)}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                        ))}
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
            {activeStep === 5 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Your Date of Birth
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <DesktopDatePicker
                            label="Date"
                            value={dateOfBirth}
                            onChange={(newValue) => handleDateChange(setDateOfBirth, newValue)}
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
            {activeStep === 6 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Your Tax Details
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(taxDetails).map(([key, value]) => (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    label={key}
                                    variant="outlined"
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange(setTaxDetails)}
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
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button">
                            Next
                        </Button>
                    </div>
                </div>
            )}
            {activeStep === 7 && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Are you the sole owner?
                    </Typography>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <Button
                                variant={isSoleOwner ? "contained" : "outlined"}
                                onClick={() => setIsSoleOwner(true)}
                            >
                                Yes
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={!isSoleOwner ? "contained" : "outlined"}
                                onClick={() => setIsSoleOwner(false)}
                            >
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
                        Indicate Ownership Percentage (0-100%)
                    </Typography>
                    <Slider
                        value={ownershipPercentage}
                        onChange={handleSliderChange}
                        aria-labelledby="ownership-percentage"
                        valueLabelDisplay="on"
                        step={1}
                        marks
                        min={0}
                        max={100}
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
                                <Button
                                    variant={loanPurpose === purpose ? "contained" : "outlined"}
                                    onClick={() => setLoanPurpose(purpose)}
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
                            Next
                        </Button>
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
                            <Button
                                variant={addSecondOwner ? "contained" : "outlined"}

                                onClick={() => setAddSecondOwner(true)}
                            >
                                Yes
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={!addSecondOwner ? "contained" : "outlined"}

                                onClick={() => setAddSecondOwner(false)}
                            >
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
                                <Button
                                    variant={loanPurpose === purpose ? "contained" : "outlined"}
                                    onClick={() => setLoanPurpose(purpose)}
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
                            Next
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
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button" disable={!isSecondOwnerValid()}>
                            Next
                        </Button>
                    </div>
                </div>
            )}
            {activeStep === 11 && !isSoleOwner && addSecondOwner && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Second Owner Tax Details
                    </Typography>
                    <Grid container spacing={2}>
                        {Object.entries(secondOwnerTaxDetails).map(([key, value]) => (
                            <Grid item xs={12} key={key}>
                                <TextField
                                    label={key}
                                    variant="outlined"
                                    name={key}
                                    value={value}
                                    onChange={handleInputChange(setSecondOwnerTaxDetails)}
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
                        <Button variant="contained" color="primary" onClick={handleNext} className="next-button">
                            Next
                        </Button>
                    </div>
                </div>
            )}
            {activeStep === 12 && !isSoleOwner && addSecondOwner && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        Second Owner Date of Birth
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <DesktopDatePicker
                            label="Date"
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
                   {activeStep === 13 && !isSoleOwner && addSecondOwner && (
                <div className="step-content">
                    <Typography variant="h5" align="center" gutterBottom>
                        What do you need the money for?
                    </Typography>
                    <Grid container spacing={2}>
                        {loanPurposes.map(purpose => (
                            <Grid item xs={12} sm={6} key={purpose}>
                                <Button
                                    variant={loanPurpose === purpose ? "contained" : "outlined"}
                                    onClick={() => setLoanPurpose(purpose)}
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
            {activeStep === 14 && !isSoleOwner && addSecondOwner && (
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
        </div>
    );
};

export default MultiStepFormExtended;
