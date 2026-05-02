import { Router, type IRouter } from "express";
import healthRouter from "./health";
import clientsRouter from "./clients";
import caregiversRouter from "./caregivers";
import appointmentsRouter from "./appointments";
import callLogsRouter from "./call_logs";
import remindersRouter from "./reminders";
import escalationsRouter from "./escalations";
import dashboardRouter from "./dashboard";
import voiceAgentRouter from "./voice_agent";

const router: IRouter = Router();

router.use(healthRouter);
router.use(clientsRouter);
router.use(caregiversRouter);
router.use(appointmentsRouter);
router.use(callLogsRouter);
router.use(remindersRouter);
router.use(escalationsRouter);
router.use(dashboardRouter);
router.use(voiceAgentRouter);

export default router;
