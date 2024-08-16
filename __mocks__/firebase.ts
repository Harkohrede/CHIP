// __mocks__/firebase.ts
export const initializeApp = jest.fn();
export const getFirestore = jest.fn(() => ({}));
export const getAuth = jest.fn(() => ({}));
export const getAnalytics = jest.fn(() => ({}));
export const getStorage = jest.fn(() => ({}));
