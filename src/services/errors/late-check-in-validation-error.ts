export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      'The check-in can oly be validated util 20 minutes of its creation.',
    )
  }
}
