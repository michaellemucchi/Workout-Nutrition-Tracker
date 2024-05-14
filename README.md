# MyFitnessApp

MyFitnessApp is a web application designed to help users track their fitness and nutrition. Users can log their meals, workouts, and track their progress over time.

## Features

- User registration and authentication
- Meal logging and tracking
- Workout logging and tracking
- User profile management
- JWT-based authentication

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root of the project with the following content:
    ```env
    PORT=3000
    JWT_SECRET=your_secret_key
    ```

4. Start the server:
    ```sh
    npm start
    ```

## Usage

- Use Postman or similar tools to interact with the API.
- Example endpoints:
  - `POST /users/register` - Register a new user
  - `POST /users/login` - Login a user
  - `GET /users/profile` - Get the authenticated user's profile
  - `POST /meals/AddMeal` - Add a meal
  - `GET /meals/AllMeals` - Get all meals
  - `POST /workouts/AddWorkout` - Add a workout
  - `GET /workouts/AllWorkouts` - Get all workouts

## Contributing

1. Fork the repository.
2. Create a new branch:
    ```sh
    git checkout -b feature-name
    ```
3. Make your changes and commit them:
    ```sh
    git commit -m 'Add some feature'
    ```
4. Push to the branch:
    ```sh
    git push origin feature-name
    ```
5. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
