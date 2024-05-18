import React, { useState } from 'react';

const DocuSignComponent = () => {
    const dsReturnUrl = "https://docusign.github.io/jsfiddleDsResponse.html";
    const docUrl = "https://docusign.github.io/examples/docs/simple_with_image.html.txt";
    const [accessToken, setAccessToken] = useState('');
    const [userInfo, setUserInfo] = useState(null);
    const [envelopeId, setEnvelopeId] = useState('');
    const [logMessages, setLogMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    // Simulate fetching document in Base64
    const fetchDocumentBase64 = async () => {
        // Here you would fetch the document content from the server
        return "base64_encoded_document";
    };

    // API to create the envelope
    const createEnvelope = async (signer) => {
        const docB64 = await fetchDocumentBase64();
        const req = {
            emailSubject: "Please sign the attached document",
            status: "sent",
            documents: [{
                name: "Example document",
                documentBase64: docB64,
                fileExtension: "html",
                documentId: "1",
            }],
            recipients: {
                signers: [signer]
            }
        };

        // Simulate API call to create an envelope
        console.log("Request to create an envelope:", req);
        setLogMessages(prev => [...prev, "Creating envelope..."]);
        return "simulated_envelope_id"; // Simulate success
    };

    // API to start embedded signing ceremony
    const embeddedSigningCeremony = async (envelopeId, signer) => {
        const req = {
            returnUrl: dsReturnUrl,
            authenticationMethod: "None",
            clientUserId: signer.clientUserId,
            email: signer.email,
            userName: signer.name
        };

        console.log("Request for embedded signing:", req);
        // Normally you'd make an API call here
        setLogMessages(prev => [...prev, "Opening embedded signing ceremony..."]);
        window.open(`https://example.com/signing?envelopeId=${envelopeId}`, "_blank");
    };

    // Handle user login
    const handleLogin = async () => {
        // Simulate login
        setAccessToken('simulated_access_token');
        setUserInfo({
            name: 'John Doe',
            email: 'john.doe@example.com',
            clientUserId: 1000
        });
        setLoggedIn(true);
        setLogMessages(prev => [...prev, "Logged in successfully"]);
    };

    // Process the 'Send and Sign' action
    const handleSendAndSign = async () => {
        setLoading(true);
        const signer = {
            email: userInfo.email,
            name: userInfo.name,
            clientUserId: userInfo.clientUserId,
            recipientId: "1"
        };

        const newEnvelopeId = await createEnvelope(signer);
        setEnvelopeId(newEnvelopeId);
        await embeddedSigningCeremony(newEnvelopeId, signer);
        setLoading(false);
    };

    return (
        <div>
            {!loggedIn ? (
                <button onClick={handleLogin}>Log in with your DocuSign developer account</button>
            ) : (
                <button onClick={handleSendAndSign} disabled={loading}>
                    {loading ? 'Processing...' : 'Send and Sign an Envelope'}
                </button>
            )}
            <div>
                <h3>Logs</h3>
                {logMessages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
        </div>
    );
};

export default DocuSignComponent;
