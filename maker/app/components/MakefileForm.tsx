'use client'

import { useState } from 'react';

const MakefileForm = () => {
  // Configuration for compilers and flags
  const config = {
    compilers: ['cc', 'gcc', 'clang'],
    flags: ['-Wall', '-Wextra', '-Werror', '-O2', '-g'],
  };

  const [compiler, setCompiler] = useState<string>(config.compilers[0]);
  const [flags, setFlags] = useState<string[]>([]);
  const [sourceFiles, setSourceFiles] = useState<string[]>(['*.c']);
  const [buildDir, setBuildDir] = useState<string>('build');
  const [execName, setExecName] = useState<string>('executable');
  const [additionalOptions, setAdditionalOptions] = useState<string[]>([]);

  const handleFlagsChange = (flag: string) => {
    setFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const handleOptionsChange = (option: string) => {
    setAdditionalOptions((prev) => {
      let newOptions = [...prev];

      if (option === 'clean') {
        if (newOptions.includes('clean')) {
          newOptions = newOptions.filter((o) => o !== 'clean' && o !== 'fclean' && o !== 're');
        } else {
          newOptions.push('clean');
        }
      } else if (option === 'fclean') {
        if (newOptions.includes('fclean')) {
          newOptions = newOptions.filter((o) => o !== 'fclean' && o !== 're');
        } else {
          newOptions.push('fclean');
          if (!newOptions.includes('clean')) {
            newOptions.push('clean');
          }
        }
      } else if (option === 're') {
        if (newOptions.includes('re')) {
          newOptions = newOptions.filter((o) => o !== 're');
        } else {
          newOptions.push('re');
          if (!newOptions.includes('fclean')) {
            newOptions.push('fclean');
          }
          if (!newOptions.includes('clean')) {
            newOptions.push('clean');
          }
        }
      }

      return newOptions;
    });
  };

  const generateMakefile = () => {
    let makefileContent = `
CC = ${compiler}
CFLAGS = ${flags.join(' ')}

SRCS = ${sourceFiles.join(' ')}
OBJS = $(SRCS:.c=.o)
EXEC = ${execName}

all: $(EXEC)

$(EXEC): $(OBJS)
\t@mkdir -p $(dir $(EXEC))
\t$(CC) $(CFLAGS) -o $(EXEC) $(OBJS)
`.trim();

    if (additionalOptions.includes('clean')) {
      makefileContent += `
    
clean:
\trm -f $(OBJS)`;
    }

    if (additionalOptions.includes('fclean')) {
      makefileContent += `
    
fclean: clean
\trm -f $(EXEC)`;
    }

    if (additionalOptions.includes('re')) {
      makefileContent += `
    
re: fclean all`;
    }
    makefileContent += '\n\n'
    makefileContent += `
    \n.PHONY: all${additionalOptions.includes('clean') ? ' clean' : ''}${additionalOptions.includes('fclean') ? ' fclean' : ''}${additionalOptions.includes('re') ? ' re' : ''}
`.trim();

    navigator.clipboard.writeText(makefileContent);
    alert('Makefile copied to clipboard!');
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-600">
      <div className="max-w-lg mx-auto p-8 bg-white shadow-md rounded-lg text-black">
        <h2 className="text-2xl font-bold mb-4">Makefile Generator</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Compiler:</label>
          <div className="mt-2">
            {config.compilers.map((comp) => (
              <label key={comp} className="mr-4">
                <input
                  type="radio"
                  value={comp}
                  checked={compiler === comp}
                  onChange={(e) => setCompiler(e.target.value)}
                  className="mr-2"
                />
                {comp.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Flags:</label>
          <div className="mt-2 space-y-2">
            {config.flags.map((flag) => (
              <label key={flag} className="block">
                <input
                  type="checkbox"
                  value={flag}
                  checked={flags.includes(flag)}
                  onChange={() => handleFlagsChange(flag)}
                  className="mr-2"
                />
                {flag}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Source Files:</label>
          <input
            type="text"
            value={sourceFiles.join(' ')}
            onChange={(e) => setSourceFiles(e.target.value.split(' '))}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Build Directory:</label>
          <input
            type="text"
            value={buildDir}
            onChange={(e) => setBuildDir(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Executable Name:</label>
          <input
            type="text"
            value={execName}
            onChange={(e) => setExecName(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Additional Options:</label>
          <div className="mt-2 space-y-2">
            {['clean', 'fclean', 're'].map((option) => (
              <label key={option} className="block">
                <input
                  type="checkbox"
                  value={option}
                  checked={additionalOptions.includes(option)}
                  onChange={() => handleOptionsChange(option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generateMakefile}
          className="w-full bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Generate Makefile
        </button>
      </div>
    </div>
  );
};

export default MakefileForm;
