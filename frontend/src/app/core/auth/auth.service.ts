import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { User } from '../../shared/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private userSubject = new BehaviorSubject<any | null>(null);
    user$: Observable<any | null> = this.userSubject.asObservable();

    constructor(private afAuth: AngularFireAuth) {
        const mockUser = localStorage.getItem('mock_auth_user');
        if (mockUser) {
            this.userSubject.next(JSON.parse(mockUser));
        } else {
            this.afAuth.authState.subscribe(user => {
                if (user) {
                    const userData = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        emailVerified: user.emailVerified
                    };
                    this.userSubject.next(userData);
                } else {
                    this.userSubject.next(null);
                }
            });
        }
    }

    async register(email: string, password: string): Promise<firebase.auth.UserCredential | null> {
        try {
            const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
            return userCredential;
        } catch (error) {
            console.error('Registration error:', error);
            throw error; // Throw so component handles UI
        }
    }

    async login(email: string, password: string): Promise<firebase.auth.UserCredential | null> {
        try {
            const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
            return userCredential;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    mockLogin() {
        // Randomly select one of the mock identities
        const mockUsers = [
            {
                uid: 'mock_user_1',
                email: 'alice@example.com',
                displayName: 'Alice Reader',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
                emailVerified: true
            },
            {
                uid: 'mock_user_2',
                email: 'steve@example.com',
                displayName: 'Steve Rogers',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Steve',
                emailVerified: true
            },
            {
                uid: 'mock_user_3',
                email: 'sarah@example.com',
                displayName: 'Sarah Connor',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
                emailVerified: true
            },
            {
                uid: 'mock_user_4',
                email: 'mike@example.com',
                displayName: 'Mike Wazowski',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
                emailVerified: true
            },
            {
                uid: 'mock_user_5',
                email: 'rachel@example.com',
                displayName: 'Rachel Green',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
                emailVerified: true
            }
        ];

        const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];

        localStorage.setItem('mock_auth_user', JSON.stringify(randomUser));
        this.userSubject.next(randomUser);
        return Promise.resolve(randomUser);
    }

    isAuthenticated(): boolean {
        return !!this.userSubject.value;
    }

    getCurrentUser() {
        return this.userSubject.value;
    }

    async getIdToken(): Promise<string | null> {
        const user = await this.afAuth.currentUser;
        if (user) {
            return await user.getIdToken();
        }
        return null;
    }

    signOut(): Promise<void> {
        localStorage.removeItem('mock_auth_user');
        this.userSubject.next(null);
        return this.afAuth.signOut();
    }
}
