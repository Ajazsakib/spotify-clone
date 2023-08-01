export const removeAutoFillEmailPassword = ()=>{
    // Remove auto-filling for email and password fields
    const inputs = document.querySelectorAll('input[name="email"], input[name="password"]');
    inputs.forEach((input) => {
      input.readOnly = true;
      input.addEventListener('focus', () => {
        input.readOnly = false;
      });
    });


    return () => {
        // Cleanup: remove event listeners
        inputs.forEach((input) => {
          input.removeEventListener('focus', () => {
            input.readOnly = false;
          });
        });
      };
}