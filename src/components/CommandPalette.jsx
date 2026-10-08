import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useTheme } from "../context/ThemeContext";
import {
  Home, User, Zap, FolderGit2, Mail, GraduationCap,
  Sun, Moon, Palette, FileDown,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

const NAV = [
  { id: "home",      label: "Home",      icon: Home,          href: "#home"      },
  { id: "about",     label: "About",     icon: User,          href: "#about"     },
  { id: "skills",    label: "Skills",    icon: Zap,           href: "#skills"    },
  { id: "projects",  label: "Projects",  icon: FolderGit2,    href: "#projects"  },
  { id: "education", label: "Education", icon: GraduationCap, href: "#education" },
  { id: "contact",   label: "Contact",   icon: Mail,          href: "#contact"   },
];

const ACCENTS = [
  { id: "aqua",  label: "Aqua"  },
  { id: "lime",  label: "Lime"  },
  { id: "coral", label: "Coral" },
  { id: "ice",   label: "Ice"   },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    // Listen for the navbar's custom trigger event
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onOpen);
    };
  }, []);

  const run = (fn) => { fn(); setOpen(false); };
  const go  = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      shouldFilter
    >
      <div className="glass overflow-hidden rounded-2xl">
        <Command.Input placeholder="Type a command or search…" />
        <Command.Separator />
        <Command.List className="max-h-[60vh] overflow-y-auto p-2">
          <Command.Empty>Nothing matches. Try "projects".</Command.Empty>

          <Command.Group heading="Navigate">
            {NAV.map(({ id, label, icon: Icon, href }) => (
              <Command.Item key={id} onSelect={() => go(href)}>
                <Icon size={15} />
                <span className="flex-1">Go to {label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator />

          <Command.Group heading="Theme">
            <Command.Item onSelect={() => run(toggleTheme)}>
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              <span className="flex-1">
                Switch to {theme === "dark" ? "light" : "dark"} theme
              </span>
            </Command.Item>
          </Command.Group>

          <Command.Separator />

          <Command.Group heading="Accent">
            {ACCENTS.map((a) => (
              <Command.Item key={a.id} onSelect={() => run(() => setAccent(a.id))}>
                <Palette size={15} />
                <span className="flex-1">{a.label}</span>
                {accent === a.id && (
                  <span className="text-[10px] uppercase tracking-widest text-[color:var(--accent)]">
                    Active
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Separator />

          <Command.Group heading="Links">
            <Command.Item
              onSelect={() => run(() => window.open("https://github.com/Jayantrajput09", "_blank"))}
            >
              <FaGithub size={15} />
              <span className="flex-1">Open GitHub</span>
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => window.open("https://linkedin.com/", "_blank"))}
            >
              <FaLinkedin size={15} />
              <span className="flex-1">Open LinkedIn</span>
            </Command.Item>
            <Command.Item
              onSelect={() => run(() => window.open("/resume.pdf", "_blank"))}
            >
              <FileDown size={15} />
              <span className="flex-1">Download Résumé</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </div>
    </Command.Dialog>
  );
}