export interface Gratitude {
    id: string;
    userId: string;
    date: string;   // in MM/dd/yyyy format
    gratitude: string;
    isTheBest: boolean;
    formattedDate: string;  // for sorting purpose, in yyyy/MM/dd format
}
