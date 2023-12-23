function choice_question(query){
    var ids = {}
    // random seed function
    function random_seed(){
        var seed
        do {
            seed = Math.floor(Math.random()*10000000)
        }
        while (ids[seed])
        ids[seed] = true
        return seed
    }
    function find_element_choosed(node){
        return node.querySelector('input:checked')
    }
    Element.prototype.createTableElement = function(){
        var trElement = document.createElement('tr')
        this.appendChild(trElement)
        return trElement
    }
    var formElement = document.querySelector(query.form)
    var submitBtn = document.querySelector(query.submit_selector)
    var right_ans_count_element = document.querySelector(query.rightCount)
    var answer_element_list = []
    var input_element_list = []
    Array.from(query.question_list).forEach(function(question){
        // create element
        var question_box = document.createElement('div')
        var question_element = document.createElement('div')
        var index_element = document.createElement('b')
        var question_content_element = document.createElement('span')
        var answer_list_element = document.createElement('ul')
        var required_mess_element = document.createElement('span')
        // add class
        question_content_element.classList.add(query.question_content_css)
        index_element.classList.add(query.question_index_css)
        question_element.classList.add(query.element_class)
        question_box.classList.add(query.question_box)
        answer_list_element.classList.add(query.answer_list_css)
        required_mess_element.classList.add(query.require_mess_css)
        // add content 
        index_element.textContent = question.index
        question_content_element.textContent = question.question_content
        required_mess_element.textContent = query.require_mess
        // add style
        required_mess_element.style.display = 'none'
        // add answer item
        var count = 0
        var rightElement
        Array.from(question.answer_list).forEach(function(answer){
            // create element
            var answer_item_element = document.createElement('li')
            var input_element = document.createElement('input')
            var label_element = document.createElement('label')
            var answer_index = document.createElement('b')
            var answer_content = document.createElement('span')
            var seed = random_seed()
            // add class
            answer_item_element.classList.add(query.answer_box)
            input_element.type = 'radio'
            input_element.name = question.index
            input_element.id = seed
            label_element.setAttribute('for', seed)
            answer_index.classList.add(query.answer_index_css)
            answer_content.classList.add(query.answer_content_css)
            // add content
            answer_index.textContent = String.fromCharCode(65 + count ++ ) + '. '
            answer_content.textContent = answer
            // add element
            answer_item_element.appendChild(input_element)
            label_element.appendChild(answer_index)
            label_element.appendChild(answer_content)
            answer_item_element.appendChild(label_element)
            answer_list_element.appendChild(answer_item_element)
            // choose right answer
            if (answer === question.answer) rightElement = answer_item_element
            // add input element into input element list
            input_element_list.push(input_element)
        })
        // when user input
        answer_list_element.addEventListener('click', function(e){
            if (e.target.tagName === 'INPUT'){
                // remove require mess
                required_mess_element.style.display = 'none'
            }
        })
        // add element
        formElement.appendChild(question_element)
        question_element.appendChild(question_box)
        question_box.appendChild(index_element)
        question_box.appendChild(question_content_element)
        answer_element_list.push({
            element : answer_list_element,
            right : rightElement,
            required : required_mess_element,
            explain : question.explain || 'Tạm thời chưa có lời giải',
            index : question.index,
        })
        question_element.appendChild(answer_list_element)
        question_element.appendChild(required_mess_element)
    })
    // submit answer
    submitBtn.addEventListener('click', function(e){
        // validator
        var isChooseAll = true
        answer_element_list.forEach(function(element){
            var element_choosed = find_element_choosed(element.element)
            if (!element_choosed){
                element.required.style.display = 'inline-block'
                isChooseAll = false
            }
        })
        if (isChooseAll){
            // check answer
            var right_answers = 0
            var tableELement = document.querySelector(query.answer_sheet)
            var trElement = tableELement.createTableElement()
            // edit table heading
            query.answer_sheet__heading.forEach(function(value){
                var thElement = document.createElement('th')
                thElement.textContent = value
                trElement.appendChild(thElement)
            })
            // get table element
            answer_element_list.forEach(function(element){
                var element_choosed = find_element_choosed(element.element)
                if (element_choosed){
                    var parentElementChoosed = element_choosed.parentElement
                    // choose right answer
                    if (parentElementChoosed === element.right){
                        right_answers++
                    }
                    // choose wrong answer
                    else{
                        parentElementChoosed.classList.add(query.error_css)
                    }
                    // after submit
                    element.right.classList.add(query.success_css)
                    // show table
                    var trElement = tableELement.createTableElement()
                    trElement.innerHTML = `
                        <td>${element.index}</td>
                        <td>${parentElementChoosed.textContent}</td>
                        <td>${element.right.textContent}</td>
                        <td class="${query.answer_explain_css}">${element.explain}</td>
                    `
                }
            })
            // show point
            right_ans_count_element.textContent = `Bạn đã làm đúng ${right_answers}/${query.question_list.length} câu`
            // disable inputs
            input_element_list.forEach(function(input_element){
                input_element.setAttribute('disabled', true)
            })
        }
    })
}