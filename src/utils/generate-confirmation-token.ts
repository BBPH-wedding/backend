export function generateConfirmationToken(): string {
    const characters =
      '0123456789';
    const tokenLength = 6;
    let result = '';
  
    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
  
    return result;
  }
  