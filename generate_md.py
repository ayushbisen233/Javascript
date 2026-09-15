import os

def generate_markdown(week_num, conclusion):
    week_dir = f'wk{week_num}'
    output_file = os.path.join(week_dir, '24070521011_Ayush_Bisen_24070521011.md')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('**Experiment/ Case Study No.:**\n')
        f.write('**1. Experiment Title:** \n\n')
        f.write('**2. Software/Tools Required:** VS Code, Web Browser, HTML, CSS, JavaScript\n')
        f.write('**3. Experiment Program Code:** \n\n')

        # Add experiment files
        for filename in ['index.html', 'script.js', 'style.css']:
            filepath = os.path.join(week_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as src:
                    ext = filename.split('.')[-1]
                    lang = 'javascript' if ext == 'js' else ext
                    f.write(f'### `{filename}`\n')
                    f.write(f'```{lang}\n{src.read()}\n```\n\n')
        
        f.write('**4. Output:**\n![alt text](image.png)\n\n')
        f.write('**5. Case Study Title:** \n\n')
        f.write('**6. Case Study Program Code:**\n\n')

        # Add case study files
        case_files = []
        if week_num == 6:
            case_files = ['case_study.html', 'case_study.js', 'case_study.css']
        elif week_num == 7:
            case_files = ['case_study.html']
        elif week_num == 8:
            case_files = ['gym.html']
        elif week_num == 9:
            case_files = ['casestudy/index.html', 'casestudy/style.css', 'casestudy/script.js']

        for filename in case_files:
            filepath = os.path.join(week_dir, filename)
            if os.path.exists(filepath):
                with open(filepath, 'r', encoding='utf-8') as src:
                    ext = filename.split('.')[-1]
                    lang = 'javascript' if ext == 'js' else ext
                    f.write(f'### `{filename}`\n')
                    f.write(f'```{lang}\n{src.read()}\n```\n\n')

        f.write('**7. Output:**\n![alt text](image.png)\n\n')
        f.write('**8. Result/Conclusion:**\n')
        f.write(f'{conclusion}\n')

conclusions = {
    6: 'The experiment successfully demonstrated text processing using JavaScript string manipulation and regular expressions. Features like counting vowels, replacing words, finding word positions, validating and extracting emails, and reversing strings were implemented. The case study further reinforced these concepts by providing an interactive tool to count vowels and reverse strings dynamically. The application effectively handles user input and manipulates the DOM to display results seamlessly.',
    7: 'The experiment successfully demonstrated the use of JavaScript for DOM manipulation and event delegation by building a functional To-Do List application. Key features such as adding, editing, and deleting tasks were implemented dynamically without reloading the page. The case study extended event handling concepts by building a comprehensive student registration form that tracks focus, blur, input, change, submit, and reset events with live validation. The application highlights efficient ways to interact with the DOM and handle complex user interactions.',
    8: 'The experiment successfully demonstrated live DOM analysis and form validation using JavaScript events such as focus, blur, input, change, and submit. The application provides immediate visual feedback on user input for fields like name, email, phone number, and membership plan. The case study reinforced these validation patterns by implementing a more comprehensive gym admission form with live error checking and state management. The project successfully showcases how to build robust, interactive, and user-friendly forms using JavaScript.',
    9: 'The experiment successfully demonstrated dynamic theme switching and user preference persistence using JavaScript and localStorage. The application effectively manipulated CSS variables to toggle between classic green, light, and dark themes. The case study expanded upon data persistence by building an interactive technical seminar schedule, implementing both localStorage and sessionStorage to manage user-entered topics across different browser sessions.'
}

for wk in [6, 7, 8, 9]:
    generate_markdown(wk, conclusions[wk])
    print(f"Generated for wk{wk}")
