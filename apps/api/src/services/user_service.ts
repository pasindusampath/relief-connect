import { UserDao } from '../dao';
import { CreateUserDto, UserResponseDto } from '@nx-mono-repo-deployment-test/shared/src/dtos/user';
import { UserRole } from '@nx-mono-repo-deployment-test/shared/src/enums';
import { IApiResponse } from '@nx-mono-repo-deployment-test/shared/src/interfaces';

/**
 * Service layer for User business logic
 * Handles validation and business rules
 */
class UserService {
  private static instance: UserService;
  private userDao: UserDao;

  private constructor(userDao: UserDao) {
    this.userDao = userDao;
  }

  /**
   * Get UserService singleton instance
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(UserDao.getInstance());
    }
    return UserService.instance;
  }

  /**
   * Register a new user
   */
  public async registerUser(createUserDto: CreateUserDto): Promise<IApiResponse<UserResponseDto>> {
    try {
      // Validate username uniqueness
      const usernameExists = await this.userDao.usernameExists(createUserDto.username);
      if (usernameExists) {
        return {
          success: false,
          error: 'Username already exists',
        };
      }

      // Validate username format (trim and check length)
      const trimmedUsername = createUserDto.username.trim();
      if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
        return {
          success: false,
          error: 'Username must be between 3 and 50 characters',
        };
      }

      // Validate password if provided
      if (createUserDto.password !== undefined && createUserDto.password !== null) {
        if (createUserDto.password.length < 6) {
          return {
            success: false,
            error: 'Password must be at least 6 characters if provided',
          };
        }
      }

      // Role is always set to USER - never accept role from frontend for security
      const role = UserRole.USER;

      // Business logic: Create trimmed DTO
      const trimmedDto = new CreateUserDto({
        username: trimmedUsername,
        password: createUserDto.password,
      });

      const user = await this.userDao.create(trimmedDto, role);

      return {
        success: true,
        data: new UserResponseDto(user),
        message: 'User registered successfully',
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.error('Error in UserService.registerUser:', error);
      
      // Handle unique constraint violation
      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          error: 'Username already exists',
        };
      }

      return {
        success: false,
        error: 'Failed to register user',
      };
    }
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: number): Promise<IApiResponse<UserResponseDto>> {
    try {
      const user = await this.userDao.findById(id);

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: new UserResponseDto(user),
      };
    } catch (error) {
      console.error(`Error in UserService.getUserById (${id}):`, error);
      return {
        success: false,
        error: 'Failed to retrieve user',
      };
    }
  }

  /**
   * Get user by username
   */
  public async getUserByUsername(username: string): Promise<IApiResponse<UserResponseDto>> {
    try {
      const user = await this.userDao.findByUsername(username);

      if (!user) {
        return {
          success: false,
          error: 'User not found',
        };
      }

      return {
        success: true,
        data: new UserResponseDto(user),
      };
    } catch (error) {
      console.error(`Error in UserService.getUserByUsername (${username}):`, error);
      return {
        success: false,
        error: 'Failed to retrieve user',
      };
    }
  }
}

export default UserService;

