// import React, { useEffect, useRef } from 'react';
// import Swal from 'sweetalert2';
// import messageTemplates from "./MessageData/data.json";

// const apiKey = process.env.REACT_APP_API;
// const whatsAPPID = process.env.REACT_APP_WHATSAPPID;
// const whatsAppToken = process.env.REACT_APP_WHATSAPPTOKEN;

// const PdfPreview_JK = ({ pdfData, apiData, label }) => {
//   const pdfWindowRef = useRef(null);
//   const pdfNameRef = useRef("");

//      useEffect(() => {


//     const pdfWindow = window.open("", "_blank");

//     if (!pdfWindow) {
//       alert("Popup blocked! Please allow popups for this website.");
//       return;
//     }


//     const template = messageTemplates[label];
//     if (!template) {
//       alert("No template found for the provided label.");
//       return;
//     }

//     const resolvePlaceholders = (templateStr) =>
//       templateStr.replace(/{(\w+)}/g, (_, key) => {
//         const val = apiData?.[key];
//         return val != null ? String(val).trim() : "NA";
//       });

//     let subject = resolvePlaceholders(template.subject || "");
//     let body = resolvePlaceholders(template.body || "");
//     let pdfname = resolvePlaceholders(template.pdfName || "")
//       .replace(/[<>:"/\\|?*]+/g, "")
//       .substring(0, 100);
//     let whatsappMessage = resolvePlaceholders(template.whatsappMessage || "");
//     pdfNameRef.current = pdfname;

//     pdfWindow.document.write(`



//         <!DOCTYPE html>
//       <html>
//         <head>
//           <title>PDF Preview</title>
//           <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css" rel="stylesheet">
//           <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
//           <style>
//             * {
//               box-sizing: border-box;
//               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
//             }
//             .top-bar {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               padding: 10px 20px;
//               background: #f8f9fa;
//               border-bottom: 1px solid #e0e0e0;
//               box-shadow: 0 2px 5px rgba(0,0,0,0.05);
//             }
//             .top-bar h3 {
//               margin: 0;
//               color: #333;
//               font-size: 18px;
//               font-weight: 600;
//             }

//             .btn-group {
//               display: flex;
//               align-items: center;
//               gap: 10px;
//             }

//             .custom-btn {
//               background: #34a853;
//               color: white;
//               border: none;
//               border-radius: 6px;
//               padding: 8px 14px;
//               font-size: 14px;
//               cursor: pointer;
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               transition: all 0.2s ease;
//               box-shadow: 0 2px 5px rgba(0,0,0,0.15);
//             }

//             .custom-btn:hover {
//               background: #2c8e45;
//               transform: translateY(-1px);
//             }

//             .custom-btn:active {
//               transform: translateY(0);
//             }

//             .share-container {
//               position: relative;
//             }

//             .share-btn {
//               background: #4285f4;
//               color: white;
//               border: none;
//               border-radius: 6px;
//               padding: 8px 14px;
//               font-size: 14px;
//               cursor: pointer;
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               transition: all 0.2s ease;
//               box-shadow: 0 2px 5px rgba(66, 133, 244, 0.2);
//             }

//             .share-btn:hover {
//               background: #3367d6;
//               transform: translateY(-1px);
//             }

//             .share-dropdown {
//               position: absolute;
//               top: 100%;
//               right: 0;
//               background: white;
//               border-radius: 8px;
//               box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//               padding: 10px;
//               min-width: 180px;
//               z-index: 100;
//               opacity: 0;
//               visibility: hidden;
//               transform: translateY(10px);
//               transition: all 0.2s ease;
//             }

//             .share-container:hover .share-dropdown {
//               opacity: 1;
//               visibility: visible;
//               transform: translateY(0);
//             }

//             .share-option {
//               display: flex;
//               align-items: center;
//               padding: 8px 12px;
//               border-radius: 6px;
//               cursor: pointer;
//               transition: all 0.2s ease;
//               color: #333;
//             }

//             .share-option:hover {
//               background: #f0f2f5;
//             }

//             .share-option i {
//               margin-right: 10px;
//               font-size: 18px;
//               width: 24px;
//               text-align: center;
//             }

//             .email-option { color: #d44638; }
//             .whatsapp-option { color: #25D366; }

//             .embed-container {
//               height: calc(100vh - 60px);
//               width: 100%;
//             }
//             .embed-container embed {
//               width: 100%;
//               height: 100%;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="top-bar">
//             <h3>${pdfname}</h3>
//             <div class="btn-group">
//               <!-- Print Button -->
//               <button class="custom-btn" onclick="printPDF()">
//                 <i class="fas fa-print"></i> Print
//               </button>

//               <!-- Save Button -->
//               <button class="custom-btn" onclick="savePDF()">
//                 <i class="fas fa-download"></i> Save
//               </button>

//               <!-- Share Button -->
//               <div class="share-container">
//                 <button class="share-btn">
//                   <i class="fas fa-share-alt"></i> Share
//                 </button>
//                 <div class="share-dropdown">
//                   <div class="share-option email-option" id="emailBtn">
//                     <i class="fas fa-envelope"></i> Email
//                   </div>
//                   <div class="share-option whatsapp-option" id="whatsappBtn">
//                     <i class="fab fa-whatsapp"></i> WhatsApp
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div class="embed-container">
//             <embed id="pdfEmbed" src="${pdfData}" type="application/pdf" />
//           </div>

//           <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
//           <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
//           <script>
//             function printPDF() {
//               const pdfURL = document.getElementById('pdfEmbed').getAttribute('src');
//               const iframe = document.createElement('iframe');
//               iframe.style.display = 'none';
//               iframe.src = pdfURL;
//               document.body.appendChild(iframe);
//               iframe.onload = function () {
//                 iframe.contentWindow.focus();
//                 iframe.contentWindow.print();
//               };
//             }

//             function savePDF() {
//               const pdfURL = document.getElementById('pdfEmbed').getAttribute('src');
//               const link = document.createElement('a');
//               link.href = pdfURL;
//               link.download = '${pdfname || "document.pdf"}'; // fallback name
//               document.body.appendChild(link);
//               link.click();
//               document.body.removeChild(link);
//             }
//           </script>
//         </body>
//       </html>

//       `);
//     pdfWindow.document.close();

//     pdfWindow.onload = () => {
//       const emailBtn = pdfWindow.document.getElementById('emailBtn');
//       const whatsappBtn = pdfWindow.document.getElementById('whatsappBtn');

//       emailBtn.addEventListener('click', () => {
//         showShareDialog(pdfWindow, pdfData, {
//           email: getFormattedEmails(),
//           whatsapp: '',
//           subject,
//           body,
//           whatsappMessage,
//           label,
//           pdfName: pdfNameRef.current,
//           mode: 'email'
//         });
//       });

//       whatsappBtn.addEventListener("click", () => {
//         showShareDialog(pdfWindow, pdfData, {
//           email: "",
//           whatsapp: getFormattedWhatsAppNumbers(),
//           subject,
//           body,
//           whatsappMessage,
//           label,
//           pdfName: pdfNameRef.current,
//           mode: "whatsapp",
//           apiData,
//         });
//       });
//     };

//     pdfWindowRef.current = pdfWindow;

//   }, [pdfData, apiData, label]);

//   const getFormattedEmails = () => {
//     return [
//       apiData.TransportEmail,
//       apiData.RefMail,
//       apiData.billtoemail,
//       apiData.shiptoemail,
//       apiData.CarporateBillToEmailID,
//       apiData.doemail,
//       apiData.millemailid,
//       apiData.getpassemailid,
//       // apiData.bankEmail,
//     ]
//       .filter(email => email)
//       .join(',');
//   };

// const getFormattedWhatsAppNumbers = () => {
//   return [
//     // apiData.brokermobno,
//     // apiData.TransportWpNo,
//     apiData.shiptomobno,
//     // apiData.CorporateBillToWpNo,
//     // apiData.RefWpNo,
//   ]
//     .filter(wp => wp && String(wp).trim() !== "" && String(wp).trim() !== "0")  
//     .map(wp => String(wp).trim()) 
//     .filter(wp => /^\d{10}$/.test(wp)) 
//     .filter((wp, index, self) => self.indexOf(wp) === index)                                        
//     .join(',');
// };

//   const showShareDialog = (pdfWindow, pdfData, options) => {
//     pdfWindow.Swal.fire({
//       title: `Share via ${options.mode === "email" ? "Email" : "WhatsApp"}`,
//       html: `
//         <div style="text-align: left;">
//           ${options.mode === "email"
//           ? `
//             <div class="form-group" style="margin-bottom: 15px;">
//               <label for="swal-email" style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">Email Addresses (separate with commas)</label>
//               <input id="swal-email" class="swal2-input" value="${options.email || ""
//           }" type="text" style="width: 80%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
//               <small style="display: block; margin-top: 5px; color: #666;">You can enter multiple emails separated by commas</small>
//             </div>`
//           : ""
//         }
//           ${options.mode === "whatsapp"
//           ? `
//             <div class="form-group" style="margin-bottom: 15px;">
//               <label for="swal-whatsapp" style="display: block; margin-bottom: 5px; font-weight: 500; color: #555;">WhatsApp Number</label>
//               <div style="display: flex; align-items: center;">
//                 <span style="background: #f5f5f5; padding: 8px 8px; border: 1px solid #ddd; border-right: none; border-radius: 4px 0 0 4px; margin-top: 8px;">+91</span>
//                 <input id="swal-whatsapp" class="swal2-input" value="${options.whatsapp || ""
//           }" type="tel" style="flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 0 4px 4px 0; font-size: 14px;">
//               </div>
//             </div>`
//           : ""
//         }
//         </div>
//       `,
//       showCancelButton: true,
//       confirmButtonText: "Send",
//       confirmButtonColor: options.mode === "email" ? "#d44638" : "#25D366",
//       showLoaderOnConfirm: true,
//       focusConfirm: false,
//       preConfirm: () => {
//         const email =
//           options.mode === "email"
//             ? pdfWindow.Swal.getPopup()
//               .querySelector("#swal-email")
//               .value.trim()
//             : "";
//         const whatsapp =
//           options.mode === "whatsapp"
//             ? pdfWindow.Swal.getPopup()
//               .querySelector("#swal-whatsapp")
//               .value.trim()
//             : "";

//         const promises = [];

//         if (email) {
//           const emailList = email
//             .split(",")
//             .map((e) => e.trim())
//             .filter((e) => e !== "");
//           const invalidEmails = emailList.filter(
//             (e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
//           );

//           if (invalidEmails.length > 0) {
//             pdfWindow.Swal.showValidationMessage(
//               `Invalid email format: ${invalidEmails.join(", ")}`
//             );
//             return false;
//           }

//           emailList.forEach((email) => {
//             promises.push(sendEmail(pdfWindow, pdfData, email, options));
//           });
//         }

//         if (whatsapp) {
//           const numbers = whatsapp
//             .split(",")
//             .map((num) => num.trim())
//             .filter((num) => num); // remove empty

//           const invalidNumbers = numbers.filter((num) => !/^\d{10}$/.test(num));

//           if (invalidNumbers.length > 0) {
//             pdfWindow.Swal.showValidationMessage(
//               `Invalid WhatsApp number(s): ${invalidNumbers.join(
//                 ", "
//               )} (must be 10 digits)`
//             );
//             return false;
//           }

//           promises.push(
//             sendWhatsApp(pdfWindow, pdfData, numbers.join(","), options)
//           );
//         }

//         return Promise.all(promises);
//       },
//       allowOutsideClick: () => !pdfWindow.Swal.isLoading(),
//     }).then((result) => {
//       if (result.isConfirmed) {
//         pdfWindow.Swal.fire({
//           title: "Sent!",
//           text: `Document has been shared via ${options.mode === "email" ? "Email" : "WhatsApp"
//             }`,
//           icon: "success",
//           confirmButtonColor: options.mode === "email" ? "#d44638" : "#25D366",
//         });
//       }
//     });
//   };

//   const sendEmail = (pdfWindow, pdfData, email, options) => {
//     return fetch(pdfData)
//       .then((res) => res.blob())
//       .then((pdfBlob) => {
//         const formData = new FormData();
//         formData.append('pdf', pdfBlob, `${options.pdfName}.pdf`);
//         formData.append('email', email);
//         formData.append('message', options.subject);
//         formData.append('messagebody', options.body);
//         formData.append('query_label', options.label);

//         return fetch(`${apiKey}/send-pdf-email`, {
//           method: 'POST',
//           body: formData,
//         });
//       })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log('Email sent:', data.message);
//       })
//       .catch((error) => {
//         console.error('Error sending email:', error);
//         throw new Error('Failed to send email');
//       });
//   };


//   const sendWhatsApp = async (pdfWindow, pdfData, whatsappNumbers, options) => {
//   try {
//     // 1) Fetch PDF blob
//     const resp = await fetch(pdfData);
//     if (!resp.ok) throw new Error(`PDF fetch failed: ${resp.status}`);
//     const srcBlob = await resp.blob();
//     const pdfFilename = `${(options.pdfName || "document").replace(/\.pdf$/i, "")}.pdf`;
//     const fixedBlob = new Blob([srcBlob], { type: "application/pdf" });

//     // 2) Upload to 360dialog Media API (NO Google Drive)
//     const uploadForm = new FormData();
//     uploadForm.append("file", fixedBlob, pdfFilename);

//     const uploadRes = await fetch(`${apiKey}/upload-to-whatsapp-media`, {
//       method: "POST",
//       body: uploadForm,
//     });
//     if (!uploadRes.ok) throw new Error(`Media upload failed: ${uploadRes.status}`);
//     const uploadData = await uploadRes.json();

//     const mediaId = uploadData.media_id;
//     if (!mediaId) throw new Error("No media_id returned.");

//     // 3) Build template params
//     const messageTemplate = messageTemplates[options.label];
//     if (!messageTemplate || !Array.isArray(messageTemplate.params)) {
//       throw new Error(`Invalid template config for: ${options.label}`);
//     }

//     const paramArray = messageTemplate.params.map((tpl) =>
//       String(tpl).replace(/{(\w+)}/g, (_, key) => {
//         const v = options.apiData?.[key];
//         return v != null && String(v).trim() !== "" ? String(v).trim() : "N/A";
//       })
//     );

//     // 4) Validate numbers
//     const numbers = Array.from(
//       new Set(
//         String(whatsappNumbers || "")
//           .split(",")
//           .map((n) => n.trim())
//           .filter((n) => /^\d{10}$/.test(n))
//           .map((n) => `91${n}`)
//       )
//     );
//     if (numbers.length === 0) throw new Error("No valid 10-digit WhatsApp numbers.");

//     // 5) Build components
//     const includeHeader =
//       options.headerDocument === true || messageTemplate.header === "document";
//     const components = [];

//     if (includeHeader) {
//       components.push({
//         type: "header",
//         parameters: [
//           {
//             type: "document",
//             document: {
//               id: mediaId, 
//               filename: pdfFilename,
//             },
//           },
//         ],
//       });
//     }

//     if (paramArray.length > 0) {
//       components.push({
//         type: "body",
//         parameters: paramArray.map((p) => ({ type: "text", text: String(p) })),
//       });
//     }

//     // 6) Send to each number
//     for (const msisdn of numbers) {
//       const payload = {
//         messaging_product: "whatsapp",
//         to: msisdn,
//         type: "template",
//         template: {
//           namespace: "24ce09e5_33c8_4eb6_9bfc_c3e01cba4e4C",
//           name: messageTemplate.template_name,
//           language: { policy: "deterministic", code: "en" },
//           components,
//         },
//       };

//       const res = await fetch(`${apiKey}/send-whatsapp`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const sendResult = await res.json().catch(() => ({}));
//       if (!res.ok)
//         throw new Error(`Send failed (${res.status}): ${JSON.stringify(sendResult)}`);

//       console.log(`✅ Sent to ${msisdn}:`, sendResult);
//       await new Promise((r) => setTimeout(r, 2000));
//     }

//   } catch (err) {
//     console.error("❌ WhatsApp error:", err);
//     throw new Error("Message sending failed.");
//   }
// };



//   return null;
// };

// export default PdfPreview_JK;






















import React, { useEffect, useRef } from 'react';
import messageTemplates from "./MessageData/data.json";

const apiKey = process.env.REACT_APP_API;

const PdfPreview_JK = ({ pdfData, apiData, label }) => {
  const pdfWindowRef = useRef(null);
  const pdfNameRef = useRef('');

  /* ─── helpers ─── */
  const getFormattedEmails = () =>
    [
      apiData?.TransportEmail, apiData?.RefMail, apiData?.billtoemail,
      apiData?.shiptoemail, apiData?.CarporateBillToEmailID,
      apiData?.doemail, apiData?.millemailid, apiData?.getpassemailid,
      apiData?.paymentToEmail,
    ].filter(Boolean).join(',');

  const getFormattedWhatsAppNumbers = () =>
    [apiData?.CashDiffMobileNo, apiData?.SaleBillToWhatsAppNo]
      .filter(wp => wp && String(wp).trim() !== '' && String(wp).trim() !== '0')
      .map(wp => String(wp).trim())
      .filter(wp => /^\d{10}$/.test(wp))
      .filter((wp, i, self) => self.indexOf(wp) === i)
      .join(',');

  /* ─── send email ─── */
  const sendEmail = async (pdfUrl, email, options) => {
    const res = await fetch(pdfUrl);
    const blob = await res.blob();
    const fd = new FormData();
    fd.append('pdf', blob, `${options.pdfName}.pdf`);
    fd.append('email', email);
    fd.append('message', options.subject);
    fd.append('messagebody', options.body);
    fd.append('query_label', options.label);
    const r = await fetch(`${apiKey}/send-pdf-email`, { method: 'POST', body: fd });
    const d = await r.json();
    console.log('Email sent:', d.message);
  };

  /* ─── send WhatsApp ─── */
  const sendWhatsApp = async (pdfUrl, whatsappNumbers, options) => {
    const resp = await fetch(pdfUrl);
    if (!resp.ok) throw new Error(`PDF fetch failed: ${resp.status}`);
    const srcBlob = await resp.blob();
    const pdfFilename = `${(options.pdfName || 'document').replace(/\.pdf$/i, '')}.pdf`;
    const fixedBlob = new Blob([srcBlob], { type: 'application/pdf' });

    const uploadForm = new FormData();
    uploadForm.append('file', fixedBlob, pdfFilename);
    const uploadRes = await fetch(`${apiKey}/upload-to-whatsapp-media`, { method: 'POST', body: uploadForm });
    if (!uploadRes.ok) throw new Error(`Media upload failed: ${uploadRes.status}`);
    const { media_id: mediaId } = await uploadRes.json();
    if (!mediaId) throw new Error('No media_id returned.');

    const messageTemplate = messageTemplates[options.label];
    if (!messageTemplate || !Array.isArray(messageTemplate.params))
      throw new Error(`Invalid template config for: ${options.label}`);

    const paramArray = messageTemplate.params.map(tpl =>
      String(tpl).replace(/{(\w+)}/g, (_, key) => {
        const v = options.apiData?.[key];
        return v != null && String(v).trim() !== '' ? String(v).trim() : 'N/A';
      })
    );

    const numbers = Array.from(new Set(
      String(whatsappNumbers || '').split(',')
        .map(n => n.trim()).filter(n => /^\d{10}$/.test(n))
        .map(n => `91${n}`)
    ));
    if (numbers.length === 0) throw new Error('No valid WhatsApp numbers.');

    const components = [];
    if (messageTemplate.header === 'document') {
      components.push({
        type: 'header',
        parameters: [{ type: 'document', document: { id: mediaId, filename: pdfFilename } }],
      });
    }
    if (paramArray.length > 0) {
      components.push({
        type: 'body',
        parameters: paramArray.map(p => ({ type: 'text', text: String(p) })),
      });
    }

    for (const msisdn of numbers) {
      const payload = {
        messaging_product: 'whatsapp', to: msisdn, type: 'template',
        template: {
          namespace: '24ce09e5_33c8_4eb6_9bfc_c3e01cba4e4C',
          name: messageTemplate.template_name,
          language: { policy: 'deterministic', code: 'en' },
          components,
        },
      };
      const r = await fetch(`${apiKey}/send-whatsapp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(`Send failed (${r.status}): ${JSON.stringify(result)}`);
      console.log(`Sent to ${msisdn}:`, result);
      await new Promise(res => setTimeout(res, 2000));
    }
  };

  useEffect(() => {
    const pdfWindow = window.open('', '_blank');
    if (!pdfWindow) { alert('Popup blocked! Please allow popups for this website.'); return; }

    const template = messageTemplates[label];
    if (!template) { alert('No template found for the provided label.'); return; }

    const resolve = str =>
      str.replace(/{(\w+)}/g, (_, k) => {
        const v = apiData?.[k];
        return v != null ? String(v).trim() : 'NA';
      });

    const subject = resolve(template.subject || '');
    const body = resolve(template.body || '');
    const pdfname = resolve(template.pdfName || '').replace(/[<>:"/\\|?*]+/g, '').substring(0, 100);
    pdfNameRef.current = pdfname;

    const prefillEmails = getFormattedEmails();
    const prefillWA = getFormattedWhatsAppNumbers();

    pdfWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${pdfname}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    :root {
      --bg:           #f4f6fb;
      --surface:      #ffffff;
      --surface2:     #f7f8fc;
      --surface3:     #eef0f7;
      --border:       rgba(60,80,160,0.10);
      --border-hover: rgba(60,80,160,0.22);
      --text:         #1a2340;
      --text-muted:   #6b75a0;
      --primary:      #3d5af1;
      --primary-dark: #2a3ec4;
      --wa:           #22c55e;
      --wa-dark:      #16a34a;
      --email-c:      #ef4444;
      --red:          #ef4444;
      --amber:        #f59e0b;
      --r:            12px;
      --r-sm:         8px;
    }
    *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
    html, body { height:100%; background:var(--bg); font-family:'DM Sans',sans-serif; color:var(--text); }

    /* ── TOP BAR ── */
    .bar {
      position:sticky; top:0; z-index:50;
      display:flex; align-items:center; justify-content:space-between;
      padding:0 20px; height:56px;
      background:var(--surface);
      border-bottom:1px solid var(--border);
      box-shadow:0 1px 8px rgba(30,50,120,0.07);
    }
    .bar-title {
      font-weight:700; font-size:14px; color:var(--text);
      max-width:360px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    .btn-group { display:flex; align-items:center; gap:8px; }

    .act-btn {
      display:inline-flex; align-items:center; gap:7px;
      padding:7px 14px; border-radius:var(--r-sm);
      border:1.5px solid transparent;
      font-size:13px; font-weight:500; font-family:'DM Sans',sans-serif;
      cursor:pointer; transition:all .18s ease;
    }
    .act-btn.print { background:#eff2ff; color:var(--primary); border-color:rgba(61,90,241,0.2); }
    .act-btn.print:hover { background:var(--primary); color:#fff; border-color:var(--primary); }
    .act-btn.save  { background:#f0fdf4; color:var(--wa-dark); border-color:rgba(34,197,94,0.25); }
    .act-btn.save:hover  { background:var(--wa); color:#fff; border-color:var(--wa); }

    .share-btn {
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 16px; border-radius:var(--r-sm);
      border:1.5px solid rgba(61,90,241,0.25);
      background:linear-gradient(135deg,#eff2ff 0%,#f0fdf4 100%);
      color:var(--text); font-size:13px; font-weight:600; font-family:'DM Sans',sans-serif;
      cursor:pointer; transition:all .18s ease;
    }
    .share-btn:hover { background:linear-gradient(135deg,var(--primary) 0%,var(--wa) 100%); color:#fff; border-color:transparent; }
    .share-btn .icon-pair { display:flex; align-items:center; gap:4px; }
    .share-btn .ie { color:var(--email-c); font-size:13px; transition:color .18s; }
    .share-btn .iw { color:var(--wa-dark); font-size:13px; transition:color .18s; }
    .share-btn .sep { color:var(--text-muted); font-size:10px; }
    .share-btn:hover .ie, .share-btn:hover .iw { color:#fff; }

    /* ── PDF EMBED ── */
    .pdf-wrap { height:calc(100vh - 56px); width:100%; }
    .pdf-wrap embed { width:100%; height:100%; border:none; display:block; }

    /* ── OVERLAY ── */
    .overlay {
      display:none; position:fixed; inset:0;
      background:rgba(10,18,60,0.50);
      backdrop-filter:blur(5px);
      z-index:9000; align-items:center; justify-content:center;
    }
    .overlay.open { display:flex; }

    /* ── MODAL ── */
    .modal {
      width:100%; max-width:480px;
      background:#ffffff; border:1px solid rgba(60,80,160,0.12);
      border-radius:18px; overflow:hidden;
      box-shadow:0 20px 60px rgba(10,18,60,0.20); margin:0 16px;
      animation:rise .26s cubic-bezier(.34,1.56,.64,1);
    }
    @keyframes rise {
      from { opacity:0; transform:translateY(24px) scale(.97); }
      to   { opacity:1; transform:translateY(0)    scale(1);   }
    }

    .modal-head {
      display:flex; align-items:center; justify-content:space-between;
      padding:18px 20px 16px; border-bottom:1px solid var(--border); background:#fafbff;
    }
    .modal-head-left { display:flex; align-items:center; gap:12px; }
    .icon-badge {
      display:flex; align-items:center; gap:7px;
      background:#fff; border:1px solid var(--border); border-radius:10px; padding:8px 12px;
    }
    .icon-badge .ie2 { color:var(--email-c); font-size:15px; }
    .icon-badge .divl { width:1px; height:15px; background:var(--border-hover); }
    .icon-badge .iw2 { color:var(--wa-dark); font-size:15px; }
    .modal-title { font-size:16px; font-weight:700; color:var(--text); }
    .modal-sub { font-size:11.5px; color:var(--text-muted); margin-top:2px; }
    .close-btn {
      width:30px; height:30px; border-radius:8px; border:1px solid var(--border);
      background:#fff; color:var(--text-muted); font-size:12px;
      cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s;
    }
    .close-btn:hover { background:#fef2f2; border-color:#fca5a5; color:var(--red); }

    .modal-body { padding:16px 20px; display:flex; flex-direction:column; gap:12px; background:#f7f8fc; }

    .note-box {
      border-radius:8px; padding:9px 13px;
      font-size:12px; display:flex; align-items:center; gap:7px;
    }
    .note-box.info { background:#eff2ff; border:1px solid rgba(61,90,241,0.2); color:var(--primary); }

    .inp-block {
      background:#fff; border:1.5px solid var(--border);
      border-radius:var(--r); overflow:hidden; transition:border-color .18s, opacity .18s;
    }
    .inp-block:focus-within { border-color:rgba(61,90,241,0.4); }
    .inp-block.muted { opacity:0.45; }

    .inp-head {
      display:flex; align-items:center; gap:10px;
      padding:10px 14px; border-bottom:1px solid var(--border); background:var(--surface2);
    }
    .s-icon { width:28px; height:28px; border-radius:7px; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
    .s-icon.e { background:#fef2f2; color:var(--email-c); }
    .s-icon.w { background:#f0fdf4; color:var(--wa-dark); }
    .s-label { font-size:12px; font-weight:600; letter-spacing:.5px; text-transform:uppercase; color:var(--text); }

    .toggle-wrap { margin-left:auto; display:flex; align-items:center; gap:7px; }
    .tog { position:relative; width:36px; height:20px; cursor:pointer; flex-shrink:0; }
    .tog input { display:none; }
    .tog-track {
      position:absolute; inset:0; background:#dde2ee;
      border-radius:20px; border:1px solid rgba(60,80,160,0.12); transition:all .2s;
    }
    .tog-track::after {
      content:''; position:absolute; left:3px; top:50%; transform:translateY(-50%);
      width:14px; height:14px; border-radius:50%; background:#9aaac4;
      transition:all .22s cubic-bezier(.34,1.56,.64,1);
    }
    input:checked ~ .tog-track { background:var(--primary); border-color:var(--primary); }
    input:checked ~ .tog-track::after { left:19px; background:#fff; }
    .tog-lbl { font-size:11px; color:var(--text-muted); }

    .field-wrap { padding:11px 14px; background:#fff; }
    .field-wrap.wa-wrap { display:flex; align-items:center; padding:0; background:#fff; }
    .wa-pre {
      padding:0 12px; height:44px; display:flex; align-items:center;
      background:#f0fdf4; border-right:1px solid var(--border);
      font-size:13px; font-weight:600; color:var(--wa-dark); flex-shrink:0;
    }
    .inp { width:100%; background:transparent; border:none; outline:none; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; }
    .inp::placeholder { color:var(--text-muted); }
    .wa-inp { flex:1; background:transparent; border:none; outline:none; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; padding:0 14px; height:44px; }
    .wa-inp::placeholder { color:var(--text-muted); }
    .f-err { font-size:11px; color:var(--red); padding:0 14px 9px; display:none; background:#fff; }
    .f-err.on { display:block; }

    .modal-foot {
      padding:14px 20px 18px; border-top:1px solid var(--border);
      display:flex; align-items:center; justify-content:space-between; gap:10px; background:#fafbff;
    }
    .foot-hint { font-size:11px; color:var(--text-muted); display:flex; align-items:center; gap:5px; }
    .foot-hint i { color:var(--primary); }
    .foot-acts { display:flex; gap:8px; }

    .btn-cancel {
      padding:8px 16px; border-radius:var(--r-sm); border:1.5px solid var(--border);
      background:#fff; color:var(--text-muted); font-family:'DM Sans',sans-serif; font-size:13px;
      cursor:pointer; transition:all .15s;
    }
    .btn-cancel:hover { background:var(--surface3); color:var(--text); border-color:var(--border-hover); }

    .btn-send {
      padding:8px 20px; border-radius:var(--r-sm); border:none;
      background:linear-gradient(130deg,var(--primary) 0%,#6366f1 100%);
      color:#fff; font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
      cursor:pointer; display:flex; align-items:center; gap:8px; transition:all .18s ease;
    }
    .btn-send:hover:not([disabled]) { background:linear-gradient(130deg,var(--primary-dark) 0%,#4f46e5 100%); transform:translateY(-1px); }
    .btn-send[disabled] { opacity:0.38; cursor:not-allowed; transform:none; }

    /* ── TOAST STACK ── */
    #toastStack {
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      z-index:99999; display:flex; flex-direction:column-reverse; gap:8px;
      align-items:center; pointer-events:none;
    }
    .toast {
      background:#fff; border-radius:12px; padding:11px 15px;
      display:flex; align-items:center; gap:10px;
      font-size:13px; color:var(--text); min-width:240px; max-width:360px;
      box-shadow:0 8px 32px rgba(30,50,120,0.14);
      opacity:0; transform:translateY(16px);
      transition:opacity .28s ease, transform .35s cubic-bezier(.34,1.56,.64,1);
      pointer-events:auto; position:relative; overflow:hidden;
    }
    .toast.show { opacity:1; transform:translateY(0); }
    .toast.removing { opacity:0; transform:translateY(-8px); transition:opacity .22s ease, transform .22s ease; }
    .toast.t-success { border:1px solid rgba(34,197,94,0.3); }
    .toast.t-error   { border:1px solid rgba(239,68,68,0.25); }
    .toast.t-warn    { border:1px solid rgba(245,158,11,0.30); }
    .toast.t-info    { border:1px solid rgba(61,90,241,0.2); }
    .t-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0; }
    .t-success .t-icon { background:#f0fdf4; color:var(--wa-dark); }
    .t-error   .t-icon { background:#fef2f2; color:var(--red); }
    .t-warn    .t-icon { background:#fffbeb; color:var(--amber); }
    .t-info    .t-icon { background:#eff2ff; color:var(--primary); }
    .t-body { flex:1; min-width:0; }
    .t-body strong { display:block; font-weight:600; font-size:13px; }
    .t-body span { font-size:11px; color:var(--text-muted); display:block; margin-top:1px; }
    .t-prog { position:absolute; bottom:0; left:0; height:2px; border-radius:0 0 12px 12px; animation:tprog linear forwards; }
    .t-success .t-prog { background:var(--wa); }
    .t-error   .t-prog { background:var(--red); }
    .t-warn    .t-prog { background:var(--amber); }
    .t-info    .t-prog { background:var(--primary); }
    @keyframes tprog { from{width:100%} to{width:0%} }
    .t-retry {
      margin-left:auto; flex-shrink:0; padding:4px 10px; border-radius:6px;
      border:1px solid var(--border); background:var(--surface2);
      font-size:11px; font-weight:600; color:var(--text-muted);
      cursor:pointer; transition:all .15s; font-family:'DM Sans',sans-serif;
    }
    .t-retry:hover { background:var(--surface3); color:var(--text); }

    /* ── BG STATUS PILL ── */
    #bgStatus {
      position:fixed; bottom:24px; right:20px; z-index:99998;
      display:none; align-items:center; gap:8px;
      background:#fff; border:1px solid var(--border);
      border-radius:20px; padding:7px 14px;
      font-size:12px; color:var(--text-muted);
      box-shadow:0 4px 16px rgba(30,50,120,0.10);
    }
    #bgStatus.on { display:flex; }
    .bg-spin {
      width:12px; height:12px;
      border:2px solid rgba(61,90,241,0.25); border-top-color:var(--primary);
      border-radius:50%; animation:spin .7s linear infinite; flex-shrink:0;
    }
    @keyframes spin { to{transform:rotate(360deg)} }
  </style>
</head>
<body>

<!-- ── TOP BAR ── -->
<div class="bar">
  <div class="bar-title">${pdfname}</div>
  <div class="btn-group">

    <button class="act-btn print" onclick="doPrint()">
      <i class="fas fa-print"></i> Print
    </button>

    <button class="act-btn save" onclick="doSave()">
      <i class="fas fa-download"></i> Save
    </button>

    <button class="share-btn" onclick="openModal()" title="Share via Email &amp; WhatsApp">
      <div class="icon-pair">
        <i class="fas fa-envelope ie"></i>
        <span class="sep">/</span>
        <i class="fab fa-whatsapp iw"></i>
      </div>
      Share
    </button>

  </div>
</div>

<!-- ── PDF EMBED ── -->
<div class="pdf-wrap">
  <embed id="pdfEmbed" src="${pdfData}" type="application/pdf" />
</div>

<!-- ── SHARE MODAL ── -->
<div class="overlay" id="overlay" onclick="handleOverlay(event)">
  <div class="modal">

    <div class="modal-head">
      <div class="modal-head-left">
        <div class="icon-badge">
          <i class="fas fa-envelope ie2"></i>
          <div class="divl"></div>
          <i class="fab fa-whatsapp iw2"></i>
        </div>
        <div>
          <div class="modal-title">Share Document</div>
          <div class="modal-sub">Email &amp; WhatsApp</div>
        </div>
      </div>
      <button class="close-btn" onclick="closeModal()"><i class="fas fa-times"></i></button>
    </div>

    <div class="modal-body">

      <div class="note-box info" id="noneNote" style="display:none">
        <i class="fas fa-circle-info"></i>
        Enable at least one channel to send.
      </div>

      <!-- EMAIL -->
      <div class="inp-block" id="eBlock">
        <div class="inp-head">
          <div class="s-icon e"><i class="fas fa-envelope"></i></div>
          <span class="s-label">Email</span>
          <div class="toggle-wrap">
            <label class="tog">
              <input type="checkbox" id="eTog" checked onchange="syncState()">
              <div class="tog-track"></div>
            </label>
            <span class="tog-lbl">Active</span>
          </div>
        </div>
        <div class="field-wrap" id="eWrap">
          <input class="inp" type="text" id="eIn"
            placeholder="user@company.com, another@domain.com"
            value="${prefillEmails}" />
        </div>
        <div class="f-err" id="eErr"></div>
      </div>

      <!-- WHATSAPP -->
      <div class="inp-block" id="wBlock">
        <div class="inp-head">
          <div class="s-icon w"><i class="fab fa-whatsapp"></i></div>
          <span class="s-label">WhatsApp</span>
          <div class="toggle-wrap">
            <label class="tog">
              <input type="checkbox" id="wTog" checked onchange="syncState()">
              <div class="tog-track"></div>
            </label>
            <span class="tog-lbl">Active</span>
          </div>
        </div>
        <div class="field-wrap wa-wrap" id="wWrap">
          <span class="wa-pre">+91</span>
          <input class="wa-inp" type="tel" id="wIn"
            placeholder="10-digit number"
            value="${prefillWA}"  />
        </div>
        <div class="f-err" id="wErr"></div>
      </div>

    </div>

    <div class="modal-foot">
      <div class="foot-hint"></div>
      <div class="foot-acts">
        <button class="btn-cancel" onclick="closeModal()">Cancel</button>
        <button class="btn-send" id="sendBtn" onclick="handleSend()">
          <i class="fas fa-paper-plane"></i>&nbsp; Send Now
        </button>
      </div>
    </div>

  </div>
</div>

<!-- ── TOAST STACK ── -->
<div id="toastStack"></div>

<!-- ── BACKGROUND STATUS PILL ── -->
<div id="bgStatus">
  <div class="bg-spin"></div>
  <span id="bgStatusTxt">Sending in background…</span>
</div>

<script>
  /* ── modal ── */
  function openModal()  { document.getElementById('overlay').classList.add('open'); syncState(); clearErrs(); }
  function closeModal() { document.getElementById('overlay').classList.remove('open'); }
  function handleOverlay(e) { if (e.target === document.getElementById('overlay')) closeModal(); }

  /* ── toggle sync ── */
  function syncState() {
    var eOn = document.getElementById('eTog').checked;
    var wOn = document.getElementById('wTog').checked;

    document.getElementById('eWrap').style.display = eOn ? '' : 'none';
    document.getElementById('eBlock').classList.toggle('muted', !eOn);
    if (!eOn) clearErr('e');

    document.getElementById('wWrap').style.display = wOn ? '' : 'none';
    document.getElementById('wBlock').classList.toggle('muted', !wOn);
    if (!wOn) clearErr('w');

    document.getElementById('noneNote').style.display = (!eOn && !wOn) ? '' : 'none';
    document.getElementById('sendBtn').disabled = (!eOn && !wOn);
  }

  function clearErr(id) { document.getElementById(id + 'Err').classList.remove('on'); }
  function clearErrs()  { clearErr('e'); clearErr('w'); }
  function showErr(id, msg) {
    var el = document.getElementById(id + 'Err');
    el.innerHTML = '<i class="fas fa-circle-exclamation"></i>&nbsp;' + msg;
    el.classList.add('on');
  }

  /* ── print / save ── */
function doPrint() {
  var pdfUrl = document.getElementById('pdfEmbed').src;
  var printWin = window.open(pdfUrl, '_blank');
  printWin.onload = function() {
    printWin.focus();
    printWin.print();
  };
}
  function doSave() {
    var url  = document.getElementById('pdfEmbed').src;
    var link = document.createElement('a');
    link.href = url;
    link.download = '${pdfname || "document"}.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ── toast system ── */
  var _bgCount = 0;

  function showToast(opts) {
    var stack = document.getElementById('toastStack');
    var dur   = opts.duration || 4500;
    var type  = opts.type  || 't-info';
    var icon  = opts.icon  || 'fas fa-info-circle';

    var sub  = opts.sub ? opts.sub.length > 50 ? opts.sub.substring(0, 50) + '…' : opts.sub : '';

    var retryHtml = '';
    if (opts.retryKey) {
      retryHtml = '<button class="t-retry" onclick="window._retryFns[\\''+opts.retryKey+'\\']()">Retry</button>';
    }

    var t = document.createElement('div');
    t.className = 'toast ' + type;
    t.innerHTML =
      '<div class="t-icon"><i class="' + icon + '"></i></div>' +
      '<div class="t-body"><strong>' + opts.title + '</strong>' + (sub ? '<span>' + sub + '</span>' : '') + '</div>' +
      retryHtml +
      '<div class="t-prog" style="animation-duration:' + dur + 'ms"></div>';

    stack.appendChild(t);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { t.classList.add('show'); });
    });
    setTimeout(function() {
      t.classList.add('removing');
      setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }, dur);
  }

  window._retryFns = {};

  /* ── background pill ── */
  function bgStart(txt) {
    _bgCount++;
    document.getElementById('bgStatusTxt').textContent = txt || 'Delivering in background…';
    document.getElementById('bgStatus').classList.add('on');
  }
  function bgEnd() {
    _bgCount = Math.max(0, _bgCount - 1);
    if (_bgCount === 0) document.getElementById('bgStatus').classList.remove('on');
  }

  /* ── main send handler ── */
  function handleSend() {
    clearErrs();
    var eOn  = document.getElementById('eTog').checked;
    var wOn  = document.getElementById('wTog').checked;
    var eVal = eOn ? document.getElementById('eIn').value.trim() : '';
    var wVal = wOn ? document.getElementById('wIn').value.trim() : '';
    var hasErr = false;

    if (eOn) {
      if (!eVal) {
        showErr('e', 'Enter at least one email address.');
        hasErr = true;
      } else {
        var bad = eVal.split(',').map(function(x){ return x.trim(); }).filter(function(x){ return x; })
          .filter(function(x){ return !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(x); });
        if (bad.length) { showErr('e', 'Invalid email(s): ' + bad.join(', ')); hasErr = true; }
      }
    }
    if (wOn) {
      if (!wVal) {
        showErr('w', 'Enter a WhatsApp number.');
        hasErr = true;
      } else {
        var nums = wVal.split(',').map(function(x){ return x.trim(); }).filter(function(x){ return x; });
        var badN = nums.filter(function(x){ return !/^\\d{10}$/.test(x); });
        if (badN.length) { showErr('w', 'Must be 10 digits: ' + badN.join(', ')); hasErr = true; }
      }
    }
    if (hasErr) return;

    /* capture values before modal closes */
    var capturedEmail = eVal;
    var capturedWA    = wVal;
    var parts = [];
    if (eOn && eVal) parts.push('Email');
    if (wOn && wVal) parts.push('WhatsApp');

    var pdfURL = document.getElementById('pdfEmbed').src;

    /* ── OPTIMISTIC: close & show success immediately ── */
    closeModal();
    showToast({
      type: 't-success', icon: 'fas fa-check',
      title: 'Sent!',
      sub: 'Sharing via ' + parts.join(' & ') + ' — delivering now',
      duration: 4000
    });

    /* ── BACKGROUND: fire real API calls ── */
    bgStart('Delivering via ' + parts.join(' & ') + '…');
    var promises = [];

    if (eOn && capturedEmail) {
      var emailList = capturedEmail.split(',').map(function(x){ return x.trim(); }).filter(function(x){ return x; });
      var emailPromises = emailList.map(function(em) {
        return window._sendEmail(pdfURL, em)
          .then(function() {
            showToast({ type:'t-success', icon:'fas fa-envelope', title:'Email delivered', sub: em, duration:5500 });
          })
          .catch(function(err) {
            var rkey = 'email_' + Date.now();
            window._retryFns[rkey] = function() {
              bgStart('Retrying email…');
              window._sendEmail(pdfURL, em)
                .then(function(){ showToast({type:'t-success',icon:'fas fa-envelope',title:'Email delivered (retry)',sub:em,duration:5000}); bgEnd(); })
                .catch(function(e){ showToast({type:'t-error',icon:'fas fa-envelope',title:'Email still failed',sub:e.message,duration:6000}); bgEnd(); });
            };
            showToast({ type:'t-error', icon:'fas fa-envelope', title:'Email failed', sub: err.message || 'Could not deliver.', duration:7000, retryKey: rkey });
          });
      });
      promises = promises.concat(emailPromises);
    }

    if (wOn && capturedWA) {
      var waPromise = window._sendWA(pdfURL, capturedWA)
        .then(function() {
          showToast({ type:'t-success', icon:'fab fa-whatsapp', title:'WhatsApp delivered', sub: '+91 ' + capturedWA, duration:5500 });
        })
        .catch(function(err) {
          var rkey = 'wa_' + Date.now();
          window._retryFns[rkey] = function() {
            bgStart('Retrying WhatsApp…');
            window._sendWA(pdfURL, capturedWA)
              .then(function(){ showToast({type:'t-success',icon:'fab fa-whatsapp',title:'WhatsApp delivered (retry)',sub:'+91 '+capturedWA,duration:5000}); bgEnd(); })
              .catch(function(e){ showToast({type:'t-error',icon:'fab fa-whatsapp',title:'WhatsApp still failed',sub:e.message,duration:6000}); bgEnd(); });
          };
          showToast({ type:'t-error', icon:'fab fa-whatsapp', title:'WhatsApp failed', sub: err.message || 'Could not send.', duration:7000, retryKey: rkey });
        });
      promises.push(waPromise);
    }

    Promise.all(promises).finally(function() { bgEnd(); });
  }
</script>
</body>
</html>`);

    pdfWindow.document.close();

    pdfWindow.onload = () => {
      const opts = {
        subject,
        body,
        label,
        pdfName: pdfNameRef.current,
        apiData,
      };
      pdfWindow._sendEmail = (pdfUrl, email) => sendEmail(pdfUrl, email, opts);
      pdfWindow._sendWA = (pdfUrl, nums) => sendWhatsApp(pdfUrl, nums, opts);
    };

    pdfWindowRef.current = pdfWindow;
  }, [pdfData, apiData, label]);

  return null;
};

export default PdfPreview_JK;