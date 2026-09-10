export interface Project {
  id: string;
  title: string;
  category: string;
  /** Scoped accent color used inside this project's detail panel and 3D artifact */
  accent: string;
  description: string;
  longDescription: string;
  tech: string[];
  mediaUrl?: string;
  specs: Record<string, string>;
  codeSnippet: string;
  stat: { value: string; label: string };
}

export const CATEGORIES = ["All", "Deep Learning"] as const;

export const PROJECTS: Project[] = [
  {
    id: "dave-rl",
    title: "RL Dangerous Dave",
    category: "Deep Learning",
    accent: "#e05a3a",
    description:
      "A curiosity-driven PPO agent for a PyGame Dangerous Dave environment.",
    longDescription:
      "A playable PyGame re-creation of Dangerous Dave, the 1990 DOS platformer, wrapped as a Gymnasium environment and solved with PPO augmented by Random Network Distillation. A frozen target network and a trainable predictor turn prediction error on novel frames into intrinsic curiosity, so the agent explores well beyond what the score reward alone would teach it. Observations are 4-frame stacks of grayscale captures (with text and grid modes available), training runs on parallel vectorized environments, and every evaluation is automatically exported to video with ffmpeg.",
    tech: ["PyTorch", "Gymnasium", "Stable-Baselines3", "PyGame", "NumPy"],
    mediaUrl: "/demo_gifs/dangerous_dave_rl-gif.gif",
    stat: { value: "2", label: "reward streams: game score + intrinsic curiosity" },
    specs: {
      Algorithm: "PPO + Random Network Distillation (RND)",
      "Curiosity reward": "Prediction error against a frozen target network",
      Network: "Shared CNN trunk, actor + extrinsic/intrinsic value heads",
      "Action space": "Discrete(7): movement, diagonal jumps, no-op",
      Observations: "4 stacked grayscale frames; text and grid modes",
      "Reward shaping": "Score delta per step, -0.1 step penalty",
      "Training setup": "4 parallel envs, 1,000-step rollouts, annealed lr",
    },
    codeSnippet: `from torch.distributions.categorical import Categorical
from algos.utils import layer_init

class Agent(nn.Module):
    def __init__(self, envs):
        super().__init__()
        self.network = nn.Sequential(
            layer_init(nn.Conv2d(4, 32, 8, stride=4)),
            nn.ReLU(),
            layer_init(nn.Conv2d(32, 64, 4, stride=2)),
            nn.ReLU(),
            layer_init(nn.Conv2d(64, 64, 3, stride=1)),
            nn.ReLU(),
            nn.Flatten(),
            layer_init(nn.Linear(64 * 8 * 4, 256)),
            nn.ReLU(),
            layer_init(nn.Linear(256, 448)),
            nn.ReLU(),
        )
        self.actor = nn.Sequential(
            layer_init(nn.Linear(448, 448), std=0.01),
            nn.ReLU(),
            layer_init(nn.Linear(448, envs.single_action_space.n), std=0.01),
        )
        # two critics: extrinsic (game score) and intrinsic (curiosity)
        self.critic_ext = layer_init(nn.Linear(448, 1), std=0.01)
        self.critic_int = layer_init(nn.Linear(448, 1), std=0.01)

    def get_action_and_value(self, x, action=None):
        hidden = self.network(x / 255.0)
        logits = self.actor(hidden)
        probs = Categorical(logits=logits)
        if action is None:
            action = probs.sample()
        return action, probs.log_prob(action), probs.entropy(), \\
               self.critic_ext(hidden), self.critic_int(hidden)`,
  },
  {
    id: "traffic-opt",
    title: "Traffic System Optimization",
    category: "Deep Learning",
    accent: "#e0a13c",
    description: "Real-time vehicle detection with R-CNN and fuzzy logic.",
    longDescription:
      "An R-CNN model detects vehicle density in live traffic footage, feeding fuzzy logic rules that propose signal timing adjustments. A custom Streamlit interface lets you watch detection and the fuzzy reasoning happen in real time.",
    tech: ["PyTorch", "Streamlit", "Fuzzy Logic"],
    stat: { value: "0.7", label: "detection confidence threshold" },
    specs: {
      "Detection model": "R-CNN (PyTorch)",
      Input: "Live traffic video stream",
      "Decision layer": "Fuzzy inference on density",
      Visualization: "Streamlit dashboard",
    },
    codeSnippet: `import torch
from torchvision.models.detection import fasterrcnn_resnet50_fpn

model = fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

def detect_vehicles(frame, threshold=0.7):
    tensor = to_tensor(frame).unsqueeze(0)
    with torch.no_grad():
        preds = model(tensor)[0]
    boxes = preds["boxes"]
    scores = preds["scores"]
    keep = scores > threshold
    return boxes[keep].tolist()`,
  },
];

export function getProject(id: string | null | undefined): Project {
  return PROJECTS.find((p) => p.id === id) ?? PROJECTS[0];
}
