import {
  create,
  generateForgetPasswordLink,
  grantValid,
  sendReverificationToken,
  signIn,
  updatePassword,
  verifyEmail,
} from "#/controllers/user";
import { isValidPassResetToken, mustAuth } from "#/middleware/auth";
import { validate } from "#/middleware/validator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  TokenAndIDValidation,
  UpdatePasswordSchema,
} from "#/utils/validationSchema";
import { Router } from "express";
import fileParser, { RequestWithFiles } from "#/middleware/fileParser";


const router = Router();

router.post("/create", validate(CreateUserSchema), create);
router.post("/verify-email", validate(TokenAndIDValidation), verifyEmail);
router.post("/re-verify-email", sendReverificationToken);
router.post("/forget-password", generateForgetPasswordLink);
router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidation),
  isValidPassResetToken,
  grantValid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);
router.get("/is-auth", mustAuth, (req, res) => {
  res.json({
    profile: req.user,
  });
});
router.get("/public", (req, res) => {
  res.json({
    message: "You are in public route.",
  });
});
router.get("/private", mustAuth, (req, res) => {
  res.json({
    message: "You are private route",
  });
});


router.post("/update-profile", fileParser, (req: RequestWithFiles, res)=>{
  console.log(req.files)
  res.json({ok: true})
});

export default router;
