// import React, { useEffect, useState } from 'react';

// const Docu = () => {
//   const [signingUrl, setSigningUrl] = useState('');

//   useEffect(() => {
//     const getAccessToken = () => {
//       const authEndpoint = 'https://account-d.docusign.com/oauth/auth';
//       const clientId = '782d8e54-a2de-4db7-a3e5-1b9fc0ea9b3a';
//       const redirectUri = 'http://localhost:5173';
//       const responseType = 'token';
//       const scope = 'signature cors';

//       window.location.href = `${authEndpoint}?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`;
//     };

//     const handleCallback = () => {
//       const hash = window.location.hash.substring(1);
//       const params = new URLSearchParams(hash);
//       const accessToken = params.get('access_token');
//       if (accessToken) {
//         localStorage.setItem('docusign_access_token', accessToken);
//         window.location.hash = '';
//       }
//     };

//     const createEnvelope = async () => {
//       const accessToken = localStorage.getItem('docusign_access_token');
//       if (!accessToken) {
//         getAccessToken();
//         return;
//       }

//       try {
//         const accountId = '260d4f5c-ffb2-457e-a630-b79ef6fcf1b0';
//         const response = await fetch(`https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             emailSubject: 'Please sign this document',
//             documents: [{
//               documentBase64: 'BASE64_ENCODED_PDF', // Replace with actual base64 encoded PDF
//               name: 'Sample Document',
//               fileExtension: 'pdf',
//               documentId: '1',
//             }],
//             recipients: {
//               signers: [{
//                 email: 'signer@example.com',
//                 name: 'Signer Name',
//                 recipientId: '1',
//                 clientUserId: '1000',
//                 tabs: {
//                   signHereTabs: [{
//                     documentId: '1',
//                     pageNumber: '1',
//                     recipientId: '1',
//                     tabLabel: 'SignHereTab',
//                     xPosition: '100',
//                     yPosition: '100',
//                   }],
//                 },
//               }],
//             },
//             status: 'sent'
//           })
//         });

//         if (!response.ok) {
//           throw new Error('Failed to create envelope');
//         }

//         const envelope = await response.json();

//         const viewResponse = await fetch(`https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes/${envelope.envelopeId}/views/recipient`, {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//             returnUrl: 'http://localhost:3000/return',
//             authenticationMethod: 'none',
//             email: 'signer@example.com',
//             userName: 'Signer Name',
//             clientUserId: '1000'
//           })
//         });

//         if (!viewResponse.ok) {
//           throw new Error('Failed to create recipient view');
//         }

//         const view = await viewResponse.json();
//         setSigningUrl(view.url);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     handleCallback();
//     createEnvelope();
//   }, []);

//   return (
//     <div className="App">
//       {signingUrl && <iframe src={signingUrl} width="100%" height="600px" title="DocuSign"></iframe>}
//     </div>
//   );
// };

// export default Docu;


import React, { useEffect, useState } from 'react';

const Docu = () => {
  const [signingUrl, setSigningUrl] = useState('');

  useEffect(() => {
    // Function to handle obtaining the access token via OAuth
    const getAccessToken = () => {
      const authEndpoint = 'https://account-d.docusign.com/oauth/auth';
      const clientId = '782d8e54-a2de-4db7-a3e5-1b9fc0ea9b3a';
      const redirectUri = 'http://localhost:5173';
      const responseType = 'token';
      const scope = 'signature cors';

      window.location.href = `${authEndpoint}?response_type=${responseType}&scope=${scope}&client_id=${clientId}&redirect_uri=${redirectUri}`;
    };

    // Function to handle the authentication callback
    const handleCallback = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const accessToken = params.get('access_token');
      if (accessToken) {
        localStorage.setItem('docusign_access_token', accessToken);
        window.location.hash = '';
      }
    };

    // Function to create the envelope and retrieve the signing URL
    const createEnvelope = async () => {
      const accessToken = localStorage.getItem('docusign_access_token');
      if (!accessToken) {
        getAccessToken();
        return;
      }

      try {
        const accountId = '260d4f5c-ffb2-457e-a630-b79ef6fcf1b0';
        const response = await fetch(`https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            emailSubject: 'Please sign this document',
            documents: [{
              documentBase64: 'BASE64_ENCODED_PDF', // Replace with actual base64 encoded PDF
              name: 'Sample Document',
              fileExtension: 'pdf',
              documentId: '1',
            }],
            recipients: {
              signers: [{
                email: 'signer@example.com', // Optional if not sending emails
                name: 'Signer Name',
                recipientId: '1',
                clientUserId: '1000', // Ensures this is an embedded signer
                tabs: {
                  signHereTabs: [{
                    documentId: '1',
                    pageNumber: '1',
                    recipientId: '1',
                    tabLabel: 'SignHereTab',
                    xPosition: '100',
                    yPosition: '100',
                  }],
                },
              }],
            },
            status: 'sent'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to create envelope');
        }

        const envelope = await response.json();

        const viewResponse = await fetch(`https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes/${envelope.envelopeId}/views/recipient`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            returnUrl: 'http://localhost:5173',
            authenticationMethod: 'none',
            email: 'signer@example.com', // Optional if not sending emails
            userName: 'Signer Name',
            clientUserId: '1000' // Same unique identifier as above
          })
        });

        if (!viewResponse.ok) {
          throw new Error('Failed to create recipient view');
        }

        const view = await viewResponse.json();
        setSigningUrl(view.url);
      } catch (error) {
        console.error(error);
      }
    };

    handleCallback();
    createEnvelope();
  }, []);

  return (
    <div className="App">
      {signingUrl && <iframe src={signingUrl} width="100%" height="600px" title="DocuSign"></iframe>}
    </div>
  );
};

export default Docu;
