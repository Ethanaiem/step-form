import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MultiStepForm from './MultiStepForm';
import MultiStepFormExtended from './MultiStepFormExtended';
import Docu from './Docu';
import DocuSignComponent from './DocuSignComponent';
import ServerTest from './ServerTest';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MultiStepForm />} />
                <Route path="/extended-form" element={<MultiStepFormExtended />} />
                {/* <Route path='/doc' element={<Docu/>}/> */}
                {/* <Route path='/doc' element={<DocuSignComponent/>} /> */}
                <Route path='/server' element={<ServerTest/>}/>
            </Routes>
        </Router>
    );
};

export default App;
