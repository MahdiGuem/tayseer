type ClassValue = string | number | bigint | boolean | ClassArray | ClassDictionary | null | undefined;
interface ClassDictionary {
  [id: string]: any;
}
interface ClassArray extends Array<ClassValue> {}

function clsx(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      classes.push(clsx(...input));
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

// Simple tailwind-merge replacement - just returns the joined classes
// In a real app, you'd want to use the actual tailwind-merge package
function twMerge(className: string): string {
  return className;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
