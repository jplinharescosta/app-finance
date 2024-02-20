import { UpdateUserUseCase } from '../use-cases/index.js';
import { EmailAlreadyInUseError } from '../errors/user.js';
import {
    invalidPasswordResponse,
    emailIsAlreadyInUseResponse,
    fieldIsNotAllowedResponse,
    invalidIdResponse,
    checkIfPassowordIsValid,
    checkIfEmailIsValid,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
} from './helpers/index.js';

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId;

            const isIdValid = checkIfIdIsValid(userId);

            if (!isIdValid) {
                return invalidIdResponse();
            }

            const params = httpRequest.body;

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ];

            const someFieldIsNotAllowed = Object.keys(params).some(
                (field) => !allowedFields.includes(field),
            );

            if (someFieldIsNotAllowed) {
                return fieldIsNotAllowedResponse();
            }

            if (params.password) {
                const passwordIsValid = checkIfPassowordIsValid(
                    params.password,
                );
                if (!passwordIsValid) {
                    return invalidPasswordResponse(params.password);
                }
            }

            if (params.email) {
                const emailIsValid = checkIfEmailIsValid(params.email);

                if (!emailIsValid) {
                    return emailIsAlreadyInUseResponse();
                }
            }

            const updateUserUseCase = new UpdateUserUseCase();

            const updatedUser = await updateUserUseCase.execute(userId, params);

            return ok(updatedUser);
        } catch (error) {
            if (error instanceof EmailAlreadyInUseError) {
                return badRequest({ message: error.message });
            }
            console.log(error);
            return serverError();
        }
    }
}
