import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor() { }

    getUserProfile(uid: string): Observable<any> {
        const storedProfile = localStorage.getItem(`user_profile_${uid}`);
        if (storedProfile) {
            return of(JSON.parse(storedProfile));
        }

        // Seed Mock Users (if not found in localStorage)
        if (uid.startsWith('mock_user_')) {
            const mockProfiles: any = {
                'mock_user_1': {
                    userUID: 'mock_user_1',
                    username: 'BookLover99',
                    firstName: 'Alice',
                    lastName: 'Reader',
                    email: 'alice@example.com',
                    gender: 'female',
                    location: 'New York, USA',
                    birthday: '1995-05-12',
                    summary: 'Avid reader of fiction and mystery novels. Loves to swap books!',
                    instaId: '@alice_reads',
                    twitterId: '@alice_books',
                    interestedGenres: ['Fiction', 'Mystery', 'Thriller', 'Romance'],
                    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
                },
                'mock_user_2': {
                    userUID: 'mock_user_2',
                    username: 'SciFiSteve',
                    firstName: 'Steve',
                    lastName: 'Rogers',
                    email: 'steve@example.com',
                    gender: 'male',
                    location: 'San Francisco, USA',
                    birthday: '1988-11-20',
                    summary: 'Huge sci-fi fan. Always looking for the next great space opera.',
                    instaId: '@steve_scifi',
                    twitterId: '@steve_writes',
                    interestedGenres: ['Science Fiction', 'Fantasy', 'Dystopian'],
                    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve'
                },
                'mock_user_3': {
                    userUID: 'mock_user_3',
                    username: 'HistoryBuff',
                    firstName: 'Sarah',
                    lastName: 'Connor',
                    email: 'sarah@example.com',
                    gender: 'female',
                    location: 'London, UK',
                    birthday: '1990-03-15',
                    summary: 'History teacher by day, bookworm by night. Special interest in biographies.',
                    instaId: '@sarah_history',
                    twitterId: '@sarah_past',
                    interestedGenres: ['History', 'Biography', 'Non-Fiction'],
                    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
                },
                'mock_user_4': {
                    userUID: 'mock_user_4',
                    username: 'MysteryMike',
                    firstName: 'Mike',
                    lastName: 'Wazowski',
                    email: 'mike@example.com',
                    gender: 'male',
                    location: 'Chicago, USA',
                    birthday: '1992-07-08',
                    summary: 'Thrillers and crime novels are my jam.',
                    instaId: '@mike_mystery',
                    twitterId: '@mike_clues',
                    interestedGenres: ['Mystery', 'Horror', 'Crime'],
                    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike'
                },
                'mock_user_5': {
                    userUID: 'mock_user_5',
                    username: 'RomanceRachel',
                    firstName: 'Rachel',
                    lastName: 'Green',
                    email: 'rachel@example.com',
                    gender: 'female',
                    location: 'Paris, France',
                    birthday: '1994-02-14',
                    summary: 'Hopeless romantic. Love Jane Austen.',
                    instaId: '@rachel_love',
                    twitterId: '@rachel_romance',
                    interestedGenres: ['Romance', 'Classic Fiction'],
                    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel'
                }
            };

            if (mockProfiles[uid]) {
                // Save the seed to localStorage so it persists for editing later
                localStorage.setItem(`user_profile_${uid}`, JSON.stringify(mockProfiles[uid]));
                return of(mockProfiles[uid]);
            }
        }

        // Return a default profile if none exists
        return of({
            userUID: uid,
            username: 'New User',
            firstName: '',
            lastName: '',
            email: '',
            gender: 'others',
            location: '',
            birthday: '',
            summary: '',
            instaId: '',
            twitterId: '',
            interestedGenres: []
        });
    }

    updateUserProfile(uid: string, data: any): Observable<any> {
        const storedProfile = localStorage.getItem(`user_profile_${uid}`);
        let currentData = storedProfile ? JSON.parse(storedProfile) : { userUID: uid };

        // Merge existing data with updates
        const updatedData = { ...currentData, ...data };

        localStorage.setItem(`user_profile_${uid}`, JSON.stringify(updatedData));
        return of(updatedData);
    }
}
