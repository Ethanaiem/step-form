import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MultiStepForm from './MultiStepForm';
import MultiStepFormExtended from './MultiStepFormExtended';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MultiStepForm />} />
                <Route path="/extended-form" element={<MultiStepFormExtended />} />
            </Routes>
        </Router>
    );
};

export default App;
