import Appwrite from 'appwrite';




class UserServices {
    #Client;
    #account;
    constructor() {
        this.#Client = new Appwrite.Client()
            .setEndpoint(process.env.APPWRITE_ENDPOINT)
            .setProject(process.env.APPWRITE_PROJECT_ID);
        this.#account = new Appwrite.Account(this.#Client);
    }


     async createAccount({ email, password, name }) {

        try {
            return await this.account.create({userId:ID.unique(), email, password, name});

        } catch (error) {
           
            return null
        }

    }

    async getLoggedInUser() {

        try {
            return await this.#account.get();
        } catch (error) {
            console.error('Error fetching logged-in user:', error);
            return null
        }
    }

     async logOutUser() {
        try {
            await this.#account.deleteSessions()

        } catch (error) {
            console.error(error)
            return null
        }
    }

    async updateLoggedInUser(name) {
        try {
            return await this.#account.updateName(name)
        } catch (error) {
            console.log('Error occured du updating the name of the user');
            return null;
        }
    };

   async deleteLoggedInUser() {
    try {
        await this.#account.delete();
        return true;
    } catch (error) {
        console.log('Error occurred during deleting the user:', error);
        return null;
    }
   }
      

}

const userServices = new UserServices()
export default userServices