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
    var formElement = document.querySelector(query.form)
    var submitBtn = document.querySelector(query.submit_selector)
    var answer_element_list = []
    Array.from(query.question_list).forEach(function(question){
        // create element
        var question_box = document.createElement('div')
        var question_element = document.createElement('div')
        var index_element = document.createElement('b')
        var question_content_element = document.createElement('span')
        var answer_list_element = document.createElement('ul')
        // add class
        question_content_element.classList.add(query.question_content_css)
        index_element.classList.add(query.question_index_css)
        question_element.classList.add(query.element_class)
        question_box.classList.add(query.question_box)
        answer_list_element.classList.add(query.answer_list_css)
        // add content 
        index_element.textContent = question.index
        question_content_element.textContent = question.question_content
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
        })
        // add element
        formElement.appendChild(question_element)
        question_element.appendChild(question_box)
        question_box.appendChild(index_element)
        question_box.appendChild(question_content_element)
        answer_element_list.push({
            element : answer_list_element,
            right : rightElement
        })
        question_element.appendChild(answer_list_element)
    })
    // submit answer
    submitBtn.addEventListener('click', function(e){
        answer_element_list.forEach(function(element){
            var element_choosed = element.element.querySelector('input:checked')
            if (element_choosed){
                var parentElementChoosed = element_choosed.parentElement
                // choose right answer
                if (parentElementChoosed === element.right){
                }
                // choose wrong answer
                else{
                    parentElementChoosed.classList.add(query.error_css)
                }
                element.right.classList.add(query.success_css)
            }
        })
    })
}